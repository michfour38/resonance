import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function callQuestionAPI(reflections: string[]) {
  const prompt = `
You are generating exactly TWO guiding reflection questions.

Use only the user's reflections below.

Rules:
- Do not summarize.
- Do not generate a Mirror synthesis.
- Do not label sections.
- Do not write "The mirror shows".
- Do not write "Two questions".
- Return exactly two questions.
- Each question must be specific to the user's reflections.
- No generic self-help language.

REFLECTIONS:
${reflections.join("\n\n")}
`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 350,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("2Q API error:", data);
    return null;
  }

  const text = Array.isArray(data?.content)
    ? data.content
        .filter((item: { type?: string; text?: string }) => item?.type === "text")
        .map((item: { text?: string }) => item.text ?? "")
        .join("\n")
        .trim()
    : "";

  const questions = text
    .split("\n")
    .map((line: string) =>
      line
        .trim()
        .replace(/^[-•]\s*/, "")
        .replace(/^\d+[\).\s-]+/, "")
        .trim()
    )
    .filter((line: string) => line.includes("?"))
    .slice(0, 2);

  return questions.length === 2 ? questions : null;
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const weekNumber = Number(url.searchParams.get("weekNumber"));
  const dayNumber = Number(url.searchParams.get("dayNumber"));

  if (!weekNumber || !dayNumber) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const completions = await prisma.prompt_completions.findMany({
    where: {
      user_id: userId,
      day_prompts: {
        journey_days: {
          day_number: dayNumber,
          journey_weeks: {
            week_number: weekNumber,
          },
        },
      },
    },
    orderBy: { created_at: "asc" },
    select: { response: true },
  });

  const reflections = completions
    .map((c) => c.response?.trim())
    .filter((value): value is string => Boolean(value));

  if (reflections.length === 0) {
    return NextResponse.json({ error: "No reflections found" }, { status: 400 });
  }

  const questions = await callQuestionAPI(reflections);

  if (!questions) {
    return NextResponse.json(
      { error: "Could not generate questions" },
      { status: 500 }
    );
  }

  return NextResponse.json({ questions });
}