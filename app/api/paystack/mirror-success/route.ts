import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getMemberWaveContext } from "@/src/lib/wave/wave.service";
import { getCurrentDayContent } from "@/src/lib/journey/getCurrentDayContent";
import { unlockMirrorTier } from "@/app/(member)/mirror/mirror-unlock.service";

const APP_URL = "https://resonance-production-8b50.up.railway.app";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const context = await getMemberWaveContext(userId);

  let weekNumber = 1;
  let dayNumber = 1;

  if (
    context.progression.phase === "CORE" ||
    context.progression.phase === "INTEGRATION"
  ) {
    const content = await getCurrentDayContent({
      phase: context.progression.phase,
      weekNumber: context.progression.weekNumber!,
      dayNumber: context.progression.dayNumber!,
      userId,
    });

    weekNumber = content.weekNumber;
    dayNumber = content.dayNumber;
  }

  await unlockMirrorTier({
    userId,
    weekNumber,
    dayNumber,
    tier: "full",
    isPaid: true,
  });

  return NextResponse.redirect(`${APP_URL}/journey`);
}