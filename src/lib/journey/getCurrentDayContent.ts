import { prisma } from "@/lib/prisma";

export type PromptType = "thread_prompt" | "mirror_exercise";

export type JourneyPromptDTO = {
  id: string;
  type: PromptType;
  promptOrder: number;
  label: string | null;
  content: string;
  isCompleted: boolean;
  isShared: boolean;
  isUnlocked: boolean;
  completionId: string | null;
  response: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  canEdit: boolean;
};

export type CurrentDayContentParams = {
  phase: "CORE" | "INTEGRATION";
  weekNumber: number;
  dayNumber: number;
  userId?: string;
};

export type CurrentDayContentResult = {
  title: string;
  prompt: string;
  prompts: JourneyPromptDTO[];
  weekId: string | null;
  weekNumber: number;
  weekTitle: string;
  weekTheme: string;
  dayId: string | null;
  dayNumber: number;
  phase: "CORE" | "INTEGRATION";
};

type PromptCompletionRow = {
  id: string;
  response: string;
  is_shared: boolean;
  created_at: Date;
  updated_at: Date;
};

type DayPromptRow = {
  id: string;
  type: string;
  prompt_order: number;
  label: string | null;
  content: string;
  prompt_completions?: PromptCompletionRow[];
};

const EDIT_WINDOW_MS = 10 * 60 * 1000;

function isWithinEditWindow(createdAt: Date | null | undefined): boolean {
  if (!createdAt) return false;
  return Date.now() - createdAt.getTime() <= EDIT_WINDOW_MS;
}

function applyGating(prompts: JourneyPromptDTO[]): JourneyPromptDTO[] {
  let lastThreadCompleted = true;

  return prompts.map((prompt) => {
    if (prompt.type === "mirror_exercise") {
      return { ...prompt, isUnlocked: true };
    }

    const isUnlocked = lastThreadCompleted;
    lastThreadCompleted = prompt.isCompleted;
    return { ...prompt, isUnlocked };
  });
}

export async function getCurrentDayContent({
  phase,
  weekNumber,
  dayNumber,
  userId,
}: CurrentDayContentParams): Promise<CurrentDayContentResult> {
  const week = await prisma.journey_weeks.findFirst({
    where: {
      week_number: weekNumber,
      is_published: true,
    },
    include: {
      journey_days: {
        where: {
          day_number: dayNumber,
        },
        include: {
          day_prompts: {
            where: {
              is_published: true,
            },
            orderBy: {
              prompt_order: "asc",
            },
            include: userId
              ? {
                  prompt_completions: {
                    where: {
                      user_id: userId,
                    },
                    orderBy: {
                      created_at: "desc",
                    },
                    select: {
                      id: true,
                      response: true,
                      is_shared: true,
                      created_at: true,
                      updated_at: true,
                    },
                  },
                }
              : undefined,
          },
        },
      },
    },
  });

  if (!week || week.journey_days.length === 0) {
    return {
      title: "No content available",
      prompt: "This day has not been configured yet.",
      prompts: [],
      weekId: null,
      weekNumber,
      weekTitle: "No content available",
      weekTheme: "",
      dayId: null,
      dayNumber,
      phase,
    };
  }

  const day = week.journey_days[0];

  const prompts: JourneyPromptDTO[] = (day.day_prompts as DayPromptRow[]).map(
    (prompt) => {
      const completion = userId
        ? prompt.prompt_completions?.[0] ?? null
        : null;

      return {
        id: prompt.id,
        type: prompt.type as PromptType,
        promptOrder: prompt.prompt_order,
        label: prompt.label,
        content: prompt.content,
        isCompleted: completion !== null,
        isShared: completion?.is_shared ?? false,
        isUnlocked: true,
        completionId: completion?.id ?? null,
        response: completion?.response ?? null,
        createdAt: completion?.created_at?.toISOString() ?? null,
        updatedAt: completion?.updated_at?.toISOString() ?? null,
        canEdit: isWithinEditWindow(completion?.created_at),
      };
    }
  );

  const gatedPrompts = applyGating(prompts);
  const firstPrompt = gatedPrompts[0]?.content ?? "No prompt available";

  return {
    title: week.title,
    prompt: firstPrompt,
    prompts: gatedPrompts,
    weekId: week.id,
    weekNumber: week.week_number,
    weekTitle: week.title,
    weekTheme: week.theme,
    dayId: day.id,
    dayNumber: day.day_number,
    phase,
  };
}