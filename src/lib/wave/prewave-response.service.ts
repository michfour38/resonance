import { prisma } from "@/lib/prisma";

export async function getPreWaveResponses(
  userId: string,
  cohortId: string
) {
  const rows = await prisma.prewave_responses.findMany({
    where: {
      user_id: userId,
      cohort_id: cohortId,
    },
    orderBy: {
      question_index: "asc",
    },
  });

  return new Map(rows.map((row) => [row.question_index, row]));
}

export async function savePreWaveResponse(
  userId: string,
  cohortId: string,
  questionIndex: number,
  response: string
) {
  return prisma.prewave_responses.upsert({
    where: {
      user_id_cohort_id_question_index: {
        user_id: userId,
        cohort_id: cohortId,
        question_index: questionIndex,
      },
    },
    update: {
      response,
    },
    create: {
      user_id: userId,
      cohort_id: cohortId,
      question_index: questionIndex,
      response,
    },
  });
}