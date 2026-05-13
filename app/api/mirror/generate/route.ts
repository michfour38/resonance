import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
  const tier = url.searchParams.get("tier") === "full" ? "full" : "lite";

  if (!weekNumber || !dayNumber) {
    return NextResponse.redirect(`${APP_URL}/journey?mirror=invalid#mirror`);
  }

  const existing = await prisma.mirror_responses.findFirst({
    where: {
      user_id: userId,
      week_number: weekNumber,
      day_number: dayNumber,
      tier,
    },
    orderBy: { created_at: "desc" },
  });

  if (existing) {
    return NextResponse.redirect(`${APP_URL}/journey?mirror=success#mirror`);
  }

  const result = await runMirrorSynthesis(userId, weekNumber, dayNumber);

  if (!result) {
    return NextResponse.redirect(`${APP_URL}/journey?mirror=error#mirror`);
  }

  return NextResponse.redirect(`${APP_URL}/journey?mirror=success#mirror`);
}