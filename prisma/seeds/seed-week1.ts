import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek1() {
  const room = await prisma.rooms.findUnique({
    where: { slug: "hearth" },
    select: {
      id: true,
    },
  });

  if (!room) {
    throw new Error('Room "hearth" not found.');
  }

  const week = await prisma.journey_weeks.upsert({
    where: { week_number: 1 },
    update: {
      room_id: room.id,
      title: "The Hearth",
      theme: "Belonging & relational safety",
      is_published: true,
    },
    create: {
      room_id: room.id,
      week_number: 1,
      title: "The Hearth",
      theme: "Belonging & relational safety",
      is_published: true,
    },
  });

  const days = [
    {
      day_number: 1,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", content: "What makes a space feel safe enough for you to be more yourself?" },
        { prompt_order: 2, type: "thread_prompt", content: "What do you tend to notice first when you enter a new environment or group?" },
        { prompt_order: 3, type: "thread_prompt", content: "When do you feel most at ease in your own presence?" },
        { prompt_order: 4, type: "thread_prompt", content: "What tends to make you hold back, even slightly, around others?" },
        { prompt_order: 5, type: "mirror_exercise", content: "When I feel most like myself, I notice that I…" },
      ],
    },
    {
      day_number: 2,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", content: "What helps you feel a sense of belonging with someone?" },
        { prompt_order: 2, type: "thread_prompt", content: "What tends to make you feel like an outsider?" },
        { prompt_order: 3, type: "thread_prompt", content: "Do you usually feel like you belong quickly, slowly, or not at all?" },
        { prompt_order: 4, type: "thread_prompt", content: "What do you tend to do when you don’t feel like you belong?" },
        { prompt_order: 5, type: "mirror_exercise", content: "Belonging, for me, feels like…" },
      ],
    },
    {
      day_number: 3,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", content: "What part of yourself do you most easily show to others?" },
        { prompt_order: 2, type: "thread_prompt", content: "What part of yourself do you tend to keep more hidden?" },
        { prompt_order: 3, type: "thread_prompt", content: "When do you feel most seen by someone else?" },
        { prompt_order: 4, type: "thread_prompt", content: "What makes being seen feel safe, or unsafe, for you?" },
        { prompt_order: 5, type: "mirror_exercise", content: "When I feel safe enough to be fully seen, I notice that I…" },
      ],
    },
    {
      day_number: 4,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", content: "What helps you trust someone over time?" },
        { prompt_order: 2, type: "thread_prompt", content: "What tends to make you question or withdraw trust?" },
        { prompt_order: 3, type: "thread_prompt", content: "Do you give trust gradually, quickly, or cautiously?" },
        { prompt_order: 4, type: "thread_prompt", content: "What has shaped the way you trust today?" },
        { prompt_order: 5, type: "mirror_exercise", content: "Trust, for me, grows when…" },
      ],
    },
    {
      day_number: 5,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", content: "What kind of presence in another person makes you feel calm or settled?" },
        { prompt_order: 2, type: "thread_prompt", content: "What kind of presence creates tension or unease in you?" },
        { prompt_order: 3, type: "thread_prompt", content: "How do you usually respond when you feel that tension?" },
        { prompt_order: 4, type: "thread_prompt", content: "What helps you return to a sense of inner steadiness?" },
        { prompt_order: 5, type: "mirror_exercise", content: "When I feel grounded in connection, I notice…" },
      ],
    },
    {
      day_number: 6,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", content: "What do you tend to need most after you’ve shared something real or vulnerable?" },
        { prompt_order: 2, type: "thread_prompt", content: "What do you tend to do when that need isn’t met?" },
        { prompt_order: 3, type: "thread_prompt", content: "How do you usually communicate your needs, if at all?" },
        { prompt_order: 4, type: "thread_prompt", content: "What makes it easier or harder for you to ask directly for what you need?" },
        { prompt_order: 5, type: "mirror_exercise", content: "A need I often carry quietly is…" },
      ],
    },
    {
      day_number: 7,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", content: "At this stage of your life, what does belonging mean to you now?" },
        { prompt_order: 2, type: "thread_prompt", content: "Do you feel more nourished by being welcomed, by being understood, or by being chosen? Why?" },
        { prompt_order: 3, type: "thread_prompt", content: "What kind of space brings out a more honest version of you?" },
        { prompt_order: 4, type: "thread_prompt", content: "What would it feel like to belong somewhere without shrinking or proving anything?" },
        { prompt_order: 5, type: "mirror_exercise", content: "This week showed me that I…" },
      ],
    },
  ];

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
            content: prompt.content,
            is_published: true,
          },
        });
      }
    }
  }

  console.log("✅ Week 1 seeded (clean)");
}