import { prisma } from "@/lib/prisma";

export const TOTAL_PROGRESS_UNITS = 357;

export type ProgressCounterResult = {
  completed: number;
  total: number;
  ratio: number;
  breakdown: {
    prewaveResponses: number;
    waveNameVote: number;
    journeyPromptCompletions: number;
  };
};

export async function getProgressCounterForUser(
  userId: string
): Promise<ProgressCounterResult> {
  const [prewaveResponsesCount, waveNameVotesCount, promptCompletionsCount] =
    await Promise.all([
      prisma.prewave_responses.count({
        where: {
          user_id: userId,
        },
      }),

      prisma.wave_name_votes.count({
        where: {
          user_id: userId,
        },
      }),

      prisma.prompt_completions.count({
        where: {
          user_id: userId,
        },
      }),
    ]);

  const completed =
    prewaveResponsesCount + waveNameVotesCount + promptCompletionsCount;

const safeCompleted = Math.min(completed, TOTAL_PROGRESS_UNITS);
const ratio = safeCompleted / TOTAL_PROGRESS_UNITS;

  return {
    completed: safeCompleted,
    total: TOTAL_PROGRESS_UNITS,
    ratio,
    breakdown: {
      prewaveResponses: prewaveResponsesCount,
      waveNameVote: waveNameVotesCount,
      journeyPromptCompletions: promptCompletionsCount,
    },
  };
}