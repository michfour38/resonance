import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { runMirrorSynthesis } from "@/app/(member)/mirror/mirror.service";

export async function GET(request: Request) {
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

  // 🔥 Extract last 2 questions
  const lines = result.output.split("\n").map((l) => l.trim()).filter(Boolean);

  const questions = lines.slice(-2);

  return NextResponse.json({
    questions,
  });
}