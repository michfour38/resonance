import { prisma } from "@/lib/prisma";

type WaveDayParams = {
  userId: string;
  cohortId: string;
  weekNumber: number;
  dayNumber: number;
};

type CohortDayCompletionsDelegate = {
  findUnique: (args: unknown) => Promise<unknown>;
  upsert: (args: unknown) => Promise<unknown>;
  count: (args: unknown) => Promise<number>;
};

function getCohortDayCompletionsDelegate():
  | CohortDayCompletionsDelegate
  | null {
  const delegate = (prisma as unknown as Record<string, unknown>)[
    "cohort_day_completions"
  ];

  if (
    delegate &&
    typeof delegate === "object" &&
    "findUnique" in delegate &&
    "upsert" in delegate &&
    "count" in delegate
  ) {
    return delegate as CohortDayCompletionsDelegate;
  }

  return null;
}

export async function hasCompletedWaveDay(
  params: WaveDayParams
): Promise<boolean> {
  const delegate = getCohortDayCompletionsDelegate();
  if (!delegate) return false;

  const existing = await delegate.findUnique({
    where: {
      user_id_cohort_id_week_number_day_number: {
        user_id: params.userId,
        cohort_id: params.cohortId,
        week_number: params.weekNumber,
        day_number: params.dayNumber,
      },
    },
  });

  return Boolean(existing);
}

export async function markWaveDayComplete(params: WaveDayParams): Promise<void> {
  const delegate = getCohortDayCompletionsDelegate();
  if (!delegate) return;

  await delegate.upsert({
    where: {
      user_id_cohort_id_week_number_day_number: {
        user_id: params.userId,
        cohort_id: params.cohortId,
        week_number: params.weekNumber,
        day_number: params.dayNumber,
      },
    },
    update: {
      completed_at: new Date(),
    },
    create: {
      user_id: params.userId,
      cohort_id: params.cohortId,
      week_number: params.weekNumber,
      day_number: params.dayNumber,
      completed_at: new Date(),
    },
  });
}

export async function countCompletedWaveDays(params: {
  userId: string;
  cohortId: string;
  activatedAt?: Date | null;
}): Promise<number> {
  const delegate = getCohortDayCompletionsDelegate();
  if (!delegate) return 0;

  return delegate.count({
    where: {
      user_id: params.userId,
      cohort_id: params.cohortId,
      ...(params.activatedAt
        ? {
            completed_at: {
              gte: params.activatedAt,
            },
          }
        : {}),
    },
  });
}