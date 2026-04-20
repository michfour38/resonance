import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { savePreWaveResponse } from "@/src/lib/wave/prewave-response.service";

const APP_URL = "https://resonance-production-8b50.up.railway.app";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(`${APP_URL}/sign-in`);
  }

  const formData = await request.formData();

  const cohortId = String(formData.get("cohortId") ?? "");
  const questionIndex = Number(formData.get("questionIndex"));
  const response = String(formData.get("response") ?? "").trim();
  const returnTo = String(formData.get("returnTo") ?? "/prewave");

  if (!cohortId || !questionIndex || !response) {
    return NextResponse.redirect(`${APP_URL}/prewave`);
  }

  await savePreWaveResponse(userId, cohortId, questionIndex, response);

  const safeReturnTo = returnTo.startsWith("/") ? returnTo : "/prewave";
  return NextResponse.redirect(`${APP_URL}${safeReturnTo}`);
}