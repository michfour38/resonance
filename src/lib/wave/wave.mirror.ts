import { countCompletedWaveDays } from "./wave.completion";

export async function isLiteMirrorEligible(params: {
  userId: string;
  cohortId: string;
  activatedAt?: Date | null;
}): Promise<boolean> {
  const completedDays = await countCompletedWaveDays({
    userId: params.userId,
    cohortId: params.cohortId,
    activatedAt: params.activatedAt,
  });

  return completedDays >= 2;
}

export function isFullMirrorEligible(weekNumber: number | null): boolean {
  return weekNumber !== null && weekNumber >= 9;
}