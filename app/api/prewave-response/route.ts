import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { savePreWaveResponse } from "@/src/lib/wave/prewave-response.service";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const formData = await request.formData();

  const cohortId = String(formData.get("cohortId") ?? "");
  const questionIndex = Number(formData.get("questionIndex"));
  const response = String(formData.get("response") ?? "").trim();

  if (!cohortId || !questionIndex || !response) {
    return NextResponse.redirect(new URL("/journey", request.url));
  }

  await savePreWaveResponse(userId, cohortId, questionIndex, response);

  return NextResponse.redirect(new URL("/journey", request.url));
}