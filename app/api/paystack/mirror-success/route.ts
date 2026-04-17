import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const APP_URL = "https://resonance-production-8b50.up.railway.app";

const TOTAL_WEEKS = 10;
const DAYS_PER_WEEK = 7;
const MIRROR_TIER = "full";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const now = new Date();

  const unlockRows = [];

  for (let weekNumber = 1; weekNumber <= TOTAL_WEEKS; weekNumber += 1) {
    for (let dayNumber = 1; dayNumber <= DAYS_PER_WEEK; dayNumber += 1) {
      unlockRows.push({
        user_id: userId,
        week_number: weekNumber,
        day_number: dayNumber,
        tier: MIRROR_TIER,
        is_paid: true,
        unlocked_at: now,
        updated_at: now,
      });
    }
  }

  await prisma.$transaction(
    unlockRows.map((row) =>
      prisma.mirror_unlocks.upsert({
        where: {
          user_id_week_number_day_number_tier: {
            user_id: row.user_id,
            week_number: row.week_number,
            day_number: row.day_number,
            tier: row.tier,
          },
        },
        update: {
          is_paid: true,
          unlocked_at: now,
          updated_at: now,
        },
        create: row,
      })
    )
  );

  return NextResponse.redirect(`${APP_URL}/journey`);
}