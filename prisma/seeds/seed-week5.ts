import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek5() {
  const room = await prisma.rooms.findUnique({
    where: { slug: "pulse" },
    select: {
      id: true,
      slug: true,
      name: true,
      theme: true,
    },
  });

  if (!room) {
    throw new Error(
      'Room "pulse" not found. Run seed-rooms.ts before seed-week5.ts.'
    );
  }

  const week = await prisma.journey_weeks.upsert({
    where: {
      week_number: 5,
    },
    update: {
      room_id: room.id,
      title: "The Pulse",
      theme: "Attraction & relational energy",
      is_published: true,
    },
    create: {
      room_id: room.id,
      week_number: 5,
      title: "The Pulse",
      theme: "Attraction & relational energy",
      is_published: true,
    },
  });

  const days = [
    {
      day_number: 1,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What kind of energy in another person tends to draw you in most quickly?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "What do you tend to feel in your body when attraction is present?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "Do you trust your first spark of attraction, or do you question it?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "What kinds of people or dynamics tend to hold your attention most strongly?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "When attraction is present for me, I often notice…" },
      ],
    },
    {
      day_number: 2,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What is the difference between chemistry and safety for you?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "When have you mistaken intensity for compatibility?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "What kind of attraction tends to feel exciting but destabilising?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "What kind of attraction feels quieter, but more trustworthy?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "What I often confuse with attraction is…" },
      ],
    },
    {
      day_number: 3,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What makes you feel alive in connection, beyond surface attraction?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "What kind of presence energises you rather than drains you?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "When do you feel most expanded, expressive, or magnetic?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "What kind of interaction creates a sense of movement or aliveness in you?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "I feel most alive in connection when…" },
      ],
    },
    {
      day_number: 4,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What kind of attraction tends to make you lose perspective or clarity?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "How do you usually respond when chemistry is strong but something feels off?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "What tends to pull you faster than your discernment can keep up with?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "Where are you most vulnerable to confusing momentum with alignment?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "What tends to overpower my clarity is…" },
      ],
    },
    {
      day_number: 5,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What kind of attraction feels aligned with the life and love you actually want?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "What helps you stay grounded when energy is high?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "How do you know when your desire is moving in the same direction as your values?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "What kind of relational energy do you want to trust more going forward?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "The kind of attraction I want to follow more consciously is…" },
      ],
    },
    {
      day_number: 6,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What role does desire currently play in the way you choose connection?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "What part of your attraction style feels most honest, and what part feels most conditioned?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "How has your past shaped what you now feel drawn toward?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "What are you learning about the relationship between desire and truth in your life?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "I’m beginning to understand that my attraction often follows…" },
      ],
    },
    {
      day_number: 7,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What have you learned this week about the energy you move toward most naturally?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "What kind of attraction now feels less trustworthy than it once did?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "What kind of attraction feels more aligned with who you are becoming?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "What do you want to choose more consciously in the way you follow desire?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "This week showed me that attraction is…" },
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

  console.log("✅ Week 5 seeded (upgraded)");
}