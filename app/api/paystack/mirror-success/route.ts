import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCurrentDayContent } from "@/app/(member)/journey/journey.service";
import { unlockMirrorTier } from "@/app/(member)/mirror/mirror-unlock.service";

const APP_URL = "https://resonance-production-8b50.up.railway.app";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const content = await getCurrentDayContent(userId);

  const weekNumber = content?.weekNumber ?? 1;
  const dayNumber = content?.dayNumber ?? 1;

  await unlockMirrorTier({
    userId,
    weekNumber,
    dayNumber,
    tier: "full",
    isPaid: true,
  });

  return NextResponse.redirect(`${APP_URL}/journey`);
}