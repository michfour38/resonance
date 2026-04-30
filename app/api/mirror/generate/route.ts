import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { runMirrorSynthesis } from "@/app/(member)/mirror/mirror.service";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.oremea.com";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(`${APP_URL}/sign-in`);
  }

  const url = new URL(request.url);
  const weekNumber = Number(url.searchParams.get("weekNumber") ?? "0");
  const dayNumber = Number(url.searchParams.get("dayNumber") ?? "0");

  if (!weekNumber || !dayNumber) {
    return NextResponse.redirect(`${APP_URL}/journey?mirror=invalid`);
  }

  const result = await runMirrorSynthesis(userId, weekNumber, dayNumber);

  if (!result) {
    return NextResponse.redirect(`${APP_URL}/journey?mirror=error`);
  }

  return NextResponse.redirect(`${APP_URL}/journey?mirror=success#mirror`);
}