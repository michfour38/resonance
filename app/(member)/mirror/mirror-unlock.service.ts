import { prisma } from "@/lib/prisma";

export type MirrorTier = "lite" | "full";

type MirrorUnlockParams = {
  userId: string;
  weekNumber: number;
  dayNumber: number;
  tier: MirrorTier;
};

export async function isMirrorTierUnlocked(
  params: MirrorUnlockParams
): Promise<boolean> {
  // Lite is persistent across the journey
  if (params.tier === "lite") {
    const row = await prisma.mirror_unlocks.findFirst({
      where: {
        user_id: params.userId,
        tier: "lite",
        is_paid: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return Boolean(row?.unlocked_at);
  }

  // Full is also persistent across the full 10-week journey
  const row = await prisma.mirror_unlocks.findFirst({
    where: {
      user_id: params.userId,
      tier: "full",
      is_paid: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return Boolean(row?.unlocked_at);
}

export async function unlockMirrorTier(
  params: MirrorUnlockParams & { isPaid?: boolean }
) {
  const now = new Date();

  return prisma.mirror_unlocks.upsert({
    where: {
      user_id_week_number_day_number_tier: {
        user_id: params.userId,
        week_number: params.weekNumber,
        day_number: params.dayNumber,
        tier: params.tier,
      },
    },
    update: {
      is_paid: params.isPaid ?? true,
      unlocked_at: now,
      updated_at: now,
    },
    create: {
      user_id: params.userId,
      week_number: params.weekNumber,
      day_number: params.dayNumber,
      tier: params.tier,
      is_paid: params.isPaid ?? true,
      unlocked_at: now,
      updated_at: now,
    },
  });
}