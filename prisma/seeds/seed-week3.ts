import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek3() {
  const room = await prisma.rooms.findUnique({
    where: { slug: "garden" },
    select: {
      id: true,
      slug: true,
      name: true,
      theme: true,
    },
  });

  if (!room) {
    throw new Error(
      'Room "garden" not found. Run seed-rooms.ts before seed-week3.ts.'
    );
  }

const week = await prisma.journey_weeks.upsert({
  where: {
    week_number: 3
  },
  update: {
    room_id: room.id,
    title: "The Garden",
    theme: "Relational nourishment",
    is_published: true
  },
  create: {
    room_id: room.id,
    week_number: 3,
    title: "The Garden",
    theme: "Relational nourishment",
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
            "What helps you feel emotionally safe enough to soften with someone?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What makes it easier for you to trust someone over time?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "When do you feel most able to receive care from another person?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of presence feels nourishing to you in relationship?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "When I feel genuinely nourished in connection, it often looks like…",
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
          content:
            "What small things make you feel remembered, valued, or cared for?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of attention feels meaningful to you rather than performative?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What tends to open you up more — consistency, warmth, depth, or something else?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What helps you stay present when connection begins to deepen?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "I feel most cared for when…",
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
          content:
            "What do you naturally offer others when you care about them?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "Which kind of giving feels energising to you, and which kind drains you?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "Do you tend to give what you would want to receive, or what the other person actually needs?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "Where have you confused overgiving with love or loyalty?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "The way I most naturally nurture connection is…",
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
          content:
            "What tends to deplete you in relationship, even when you care deeply?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "When do you notice yourself starting to wither, shut down, or lose energy?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of dynamic slowly erodes your sense of aliveness?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "How do you usually respond when something that once felt nourishing no longer does?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "I start to lose myself in connection when…",
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
            "What do you need more of in order for connection to feel alive and mutual?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of care or reciprocity feels especially important to you right now?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What have you outgrown in the way you relate or give?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What are you starting to understand about what healthy nourishment really means for you?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "For connection to feel sustainable for me, I need…",
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
            "What makes it hard to ask directly for what would support or nourish you?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "Where do you stay silent and hope someone will just notice?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What does it bring up in you to name a need clearly?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "How might your relationships change if you asked more honestly for what helps you thrive?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "Something I need more honestly than I usually admit is…",
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
            "What have you learned this week about what truly nourishes you in connection?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What drains you more than you realised before?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What truth about your relational needs feels clearer now?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What is one way you want to care for connection differently going forward?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "What I’m learning to protect and nourish in myself is…",
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