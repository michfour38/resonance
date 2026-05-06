import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { runMirrorSynthesis } from "@/app/(member)/mirror/mirror.service";

function extractTwoQuestions(output: string) {
  const cleaned = output
    .replace(/\*\*The mirror shows:\*\*/gi, "")
    .replace(/The mirror shows:/gi, "")
    .replace(/\*\*Two questions:\*\*/gi, "")
    .replace(/Two questions:/gi, "")
    .trim();

  const questionLines = cleaned
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^[-•]\s*/, "")
        .replace(/^\d+[\).\s-]+/, "")
        .trim()
    )
    .filter((line) => line.includes("?"));

  if (questionLines.length >= 2) {
    return questionLines.slice(-2);
  }

  const questionParts = cleaned
    .split("?")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(-2)
    .map((part) => `${part}?`);

  return questionParts;
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

  const result = await runMirrorSynthesis(userId, weekNumber, dayNumber);

  if (!result?.output) {
    return NextResponse.json({ error: "No output" }, { status: 500 });
  }

  const questions = extractTwoQuestions(result.output);

  if (questions.length < 2) {
    return NextResponse.json(
      { error: "Could not extract two questions" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    questions,
  });
}