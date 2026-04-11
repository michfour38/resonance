import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { runMirrorSynthesis } from "@/app/(member)/mirror/mirror.service";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const url = new URL(request.url);
  const weekNumber = Number(url.searchParams.get("weekNumber") ?? "0");
  const dayNumber = Number(url.searchParams.get("dayNumber") ?? "0");

  if (!weekNumber || !dayNumber) {
    return NextResponse.redirect(new URL("/journey", request.url));
  }

  await runMirrorSynthesis(userId, weekNumber, dayNumber);

  return NextResponse.redirect(new URL("/journey", request.url));
}