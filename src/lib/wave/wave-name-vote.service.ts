import { prisma } from "@/lib/prisma";

export async function getUserWaveNameVote(userId: string, cohortId: string) {
  return prisma.wave_name_votes.findUnique({
    where: {
      user_id_cohort_id: {
        user_id: userId,
        cohort_id: cohortId,
      },
    },
  });
}

export async function getWaveNameVoteCounts(cohortId: string) {
  const rows = await prisma.wave_name_votes.groupBy({
    by: ["wave_name"],
    where: {
      cohort_id: cohortId,
    },
    _count: {
      wave_name: true,
    },
  });

  return new Map(rows.map((row) => [row.wave_name, row._count.wave_name]));
}

export async function saveWaveNameVote(
  userId: string,
  cohortId: string,
  waveName: string
) {
  return prisma.wave_name_votes.upsert({
    where: {
      user_id_cohort_id: {
        user_id: userId,
        cohort_id: cohortId,
      },
    },
    update: {
      wave_name: waveName,
    },
    create: {
      user_id: userId,
      cohort_id: cohortId,
      wave_name: waveName,
    },
  });
}