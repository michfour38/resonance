import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { runMirrorSynthesis } from "@/app/(member)/mirror/mirror.service";

const APP_URL = "https://resonance-production-8b50.up.railway.app";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(`${APP_URL}/sign-in`);
  }

  const url = new URL(request.url);
  const weekNumber = Number(url.searchParams.get("weekNumber") ?? "0");
  const dayNumber = Number(url.searchParams.get("dayNumber") ?? "0");

  if (!weekNumber || !dayNumber) {
    return NextResponse.redirect(`${APP_URL}/journey`);
  }

  await runMirrorSynthesis(userId, weekNumber, dayNumber);

  return NextResponse.redirect(`${APP_URL}/journey`);
}