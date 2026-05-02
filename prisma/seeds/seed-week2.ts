import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek2() {
  const room = await prisma.rooms.findUnique({
    where: { slug: "mirror" },
    select: {
      id: true,
      slug: true,
      name: true,
      theme: true,
    },
  });

  if (!room) {
    throw new Error(
      'Room "mirror" not found. Run seed-rooms.ts before seed-week2.ts.'
    );
  }

  const week = await prisma.journey_weeks.upsert({
    where: {
      week_number: 2,
    },
    update: {
      room_id: room.id,
      title: "The Mirror",
      theme: "Relational self-awareness",
      is_published: true,
    },
    create: {
      room_id: room.id,
      week_number: 2,
      title: "The Mirror",
      theme: "Relational self-awareness",
      is_published: true,
    },
  });

  const days = [
    {
      day_number: 1,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "When you’re in a conversation, what do you become most aware of — yourself, the other person, or how it’s going?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "What changes inside you when someone responds differently than you expected?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "What do you notice yourself doing when you’re unsure how you’re being perceived?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "Where does your attention go when interaction feels easy versus when it feels awkward?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "In interaction, I notice that I often…" },
      ],
    },
    {
      day_number: 2,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What is something you tend to do in many of your relationships?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "Do you find yourself taking on a similar role with different people — listener, fixer, observer, leader, or something else?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "When does that pattern usually start — early, or only after some time?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "What does that pattern cost you over time?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "A pattern I’m starting to recognise in myself is…" },
      ],
    },
    {
      day_number: 3,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What kind of interaction tends to create a strong emotional reaction in you?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "Do you notice the reaction as it happens, or only afterwards?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "What do you usually tell yourself about the situation in those moments?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "How does your behaviour change when you feel triggered?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "When I get triggered, I usually feel…" },
      ],
    },
    {
      day_number: 4,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "Think of a recent moment you felt off — what might you have needed in that moment?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "What do you often hope others will understand without you saying it?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "When you feel disappointed in someone, what was missing for you?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "How easy is it for you to identify what you need while you’re in the moment?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "What I was really needing there was…" },
      ],
    },
    {
      day_number: 5,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What do you tend to do when something feels emotionally uncomfortable?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "What do you avoid showing or saying when you feel exposed?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "When things feel uncertain, do you try to take control, step back, adapt, or something else?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "How do you create distance when something feels too close?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "When I feel vulnerable, I protect myself by…" },
      ],
    },
    {
      day_number: 6,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "How might your way of protecting yourself affect the people around you?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "How do you think others might interpret your behaviour differently from how you intend it?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "What part do you notice yourself playing in the patterns you experience with others?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "What are you starting to see about how you show up in connection?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "Something I’m beginning to see about my impact is…" },
      ],
    },
    {
      day_number: 7,
      prompts: [
        { prompt_order: 1, type: "thread_prompt", label: "", content: "What have you become more aware of about yourself this week?" },
        { prompt_order: 2, type: "thread_prompt", label: "", content: "What feels like the most important pattern you’ve noticed?" },
        { prompt_order: 3, type: "thread_prompt", label: "", content: "What truth about yourself feels uncomfortable, but real?" },
        { prompt_order: 4, type: "thread_prompt", label: "", content: "What is one way you want to show up differently going forward?" },
        { prompt_order: 5, type: "mirror_exercise", label: "", content: "The truth I’m starting to accept about myself is…" },
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

  console.log("✅ Week 2 seeded (upgraded)");
}