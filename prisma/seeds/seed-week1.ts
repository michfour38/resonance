import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek1() {
  const room = await prisma.rooms.findUnique({
    where: { slug: "hearth" },
    select: {
      id: true,
      slug: true,
      name: true,
      theme: true,
    },
  });

  if (!room) {
    throw new Error(
      'Room "hearth" not found. Run seed-rooms.ts before seed-week1.ts.'
    );
  }

const week = await prisma.journey_weeks.upsert({
  where: {
    week_number: 1
  },
  update: {
    room_id: room.id,
    title: "The Hearth",
    theme: "Belonging & relational safety",
    is_published: true
  },
  create: {
    room_id: room.id,
    week_number: 1,
    title: "The Hearth",
    theme: "Belonging & relational safety",
    is_published: true
  }
});

  const days = [
    {
      day_number: 1,
      prompts: [
        {
          prompt_order: 1,
          type: "thread_prompt",
          label: "",
          content:
            "What makes a space feel safe enough for you to be more yourself?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What do you tend to notice first when you enter a new environment or group?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content: "When do you feel most at ease in your own presence?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What tends to make you hold back, even slightly, around others?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "When I feel most like myself, I notice that I…",
        },
      ],
    },
    {
      day_number: 2,
      prompts: [
        {
          prompt_order: 1,
          type: "thread_prompt",
          label: "",
          content: "What helps you feel a sense of belonging with someone?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content: "What tends to make you feel like an outsider?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "Do you usually feel like you belong quickly, slowly, or not at all?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content: "What do you tend to do when you don’t feel like you belong?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "Belonging, for me, feels like…",
        },
      ],
    },
    {
      day_number: 3,
      prompts: [
        {
          prompt_order: 1,
          type: "thread_prompt",
          label: "",
          content: "What part of yourself do you most easily show to others?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content: "What part of yourself do you tend to keep more hidden?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content: "When do you feel most seen by someone else?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content: "What makes being seen feel safe, or unsafe, for you?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "The part of me that is easiest to show is…",
        },
      ],
    },
    {
      day_number: 4,
      prompts: [
        {
          prompt_order: 1,
          type: "thread_prompt",
          label: "",
          content: "What helps you trust someone over time?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content: "What tends to make you question or withdraw trust?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content: "Do you give trust gradually, quickly, or cautiously?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content: "What has shaped the way you trust today?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "Trust, for me, grows when…",
        },
      ],
    },
    {
      day_number: 5,
      prompts: [
        {
          prompt_order: 1,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of presence in another person makes you feel calm or settled?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of presence creates tension or unease in you?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "How do you usually respond when you feel that tension?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What helps you return to a sense of inner steadiness?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "When I feel grounded in connection, I notice…",
        },
      ],
    },
    {
      day_number: 6,
      prompts: [
        {
          prompt_order: 1,
          type: "thread_prompt",
          label: "",
          content:
            "What do you need more of to feel safe being yourself around others?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content: "What do you tend to do when that need isn’t met?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content: "How do you usually communicate your needs, if at all?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What makes it easier or harder for you to express what you need?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "Something I need more of in connection is…",
        },
      ],
    },
    {
      day_number: 7,
      prompts: [
        {
          prompt_order: 1,
          type: "thread_prompt",
          label: "",
          content:
            "What have you noticed about yourself this week that you hadn’t fully seen before?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content: "What felt most natural for you in these reflections?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content: "What felt slightly uncomfortable, but important?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What do you want to carry forward from this week into the next?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "One thing I’m beginning to understand about myself is…",
        },
      ],
    },
  ] as const;

  for (const day of days) {
    const createdDay = await prisma.journey_days.upsert({
      where: {
        week_id_day_number: {
          week_id: week.id,
          day_number: day.day_number,
        },
      },
      update: {},
      create: {
        week_id: week.id,
        day_number: day.day_number,
      },
    });

    for (const prompt of day.prompts) {
      const existingPrompt = await prisma.day_prompts.findFirst({
        where: {
          day_id: createdDay.id,
          prompt_order: prompt.prompt_order,
        },
      });

      if (existingPrompt) {
        await prisma.day_prompts.update({
          where: { id: existingPrompt.id },
          data: {
            type: prompt.type as any,
            label: prompt.label,
            content: prompt.content,
            is_published: true,
          },
        });
      } else {
        await prisma.day_prompts.create({
          data: {
            day_id: createdDay.id,
            prompt_order: prompt.prompt_order,
            type: prompt.type as any,
            label: prompt.label,
            content: prompt.content,
            is_published: true,
          },
        });
      }
    }
  }
}