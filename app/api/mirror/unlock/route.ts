import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function writeUnlock(
  userId: string,
  weekNumber: number,
  dayNumber: number,
  tier: string
) {
  const now = new Date();

  return prisma.mirror_unlocks.upsert({
    where: {
      user_id_week_number_day_number_tier: {
        user_id: userId,
        week_number: weekNumber,
        day_number: dayNumber,
        tier,
      },
    },
    update: {
      is_paid: true,
      unlocked_at: now,
      updated_at: now,
    },
    create: {
      user_id: userId,
      week_number: weekNumber,
      day_number: dayNumber,
      tier,
      is_paid: true,
      unlocked_at: now,
      updated_at: now,
    },
  });
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Not signed in." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const weekNumber = Number(url.searchParams.get("weekNumber") ?? "1");
    const dayNumber = Number(url.searchParams.get("dayNumber") ?? "2");
    const tier = String(url.searchParams.get("tier") ?? "lite");

    const row = await writeUnlock(userId, weekNumber, dayNumber, tier);

   return NextResponse.redirect(new URL("/journey", request.url));
  } catch (error) {
    console.error("GET /api/mirror/unlock failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Unknown unlock error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const formData = await request.formData();

    const weekNumber = Number(formData.get("weekNumber"));
    const dayNumber = Number(formData.get("dayNumber"));
    const tier = String(formData.get("tier") ?? "lite");

    if (!weekNumber || !dayNumber || !tier) {
      return NextResponse.redirect(new URL("/journey", request.url));
    }

    await writeUnlock(userId, weekNumber, dayNumber, tier);

    return NextResponse.redirect(new URL("/journey", request.url));
  } catch (error) {
    console.error("POST /api/mirror/unlock failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Unknown unlock error",
      },
      { status: 500 }
    );
  }
}