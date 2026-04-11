import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek6() {
  const week = await prisma.journey_weeks.upsert({
    where: { week_number: 6 },
    update: {
      title: "The Shadow",
      theme: "Emotional triggers & fear",
      room_slug: "shadow",
      room_name: "The Shadow",
      room_description:
        "The emotional undercurrents, fears, and protective patterns that shape the way you relate.",
      is_published: true,
    },
    create: {
      week_number: 6,
      title: "The Shadow",
      theme: "Emotional triggers & fear",
      room_slug: "shadow",
      room_name: "The Shadow",
      room_description:
        "The emotional undercurrents, fears, and protective patterns that shape the way you relate.",
      is_published: true,
    },
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
            "What kind of moment in connection tends to trigger you most quickly?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What do you tend to feel beneath the surface when that happens?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What story do you usually tell yourself in those moments?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "How do you usually respond when you feel emotionally activated?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "When I feel triggered, what rises first in me is…",
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
            "What fear tends to sit underneath your strongest relational reactions?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What are you most afraid might happen if you’re fully seen in connection?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What does your fear most want to protect you from?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "How does that fear shape the way you show up with others?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "What I may be protecting myself from is…",
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
            "What do you tend to do when a fear inside you is touched?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "Do you move toward, pull away, shut down, defend, or something else?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What part of that reaction feels most familiar from your past?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "How does your protection strategy affect the kind of connection you say you want?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "My protective pattern usually looks like…",
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
            "What fear do you think others most easily activate in you without meaning to?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of interaction brings you closest to feeling abandoned, rejected, unseen, or controlled?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What do you tend to assume about the other person when that fear is active?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What might actually be true that your fear makes hard to see?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "When this fear gets activated, I usually believe…",
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
            "What would it mean to stay present with your fear without letting it lead everything?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What helps you recognise that you are reacting from fear rather than from truth?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of support, honesty, or grounding would help you respond more consciously?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What becomes possible when you stop treating your fear like the whole story?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "What I want to remember when fear rises is…",
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
            "What fear are you beginning to know more intimately this week?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "How has that fear shaped the way you protect yourself in love or connection?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What truth might be waiting behind the fear, if you were willing to stay with it a little longer?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What feels different when you look at your fear with honesty instead of shame?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "Beneath this fear, I suspect there is also…",
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
            "What have you learned this week about what lives underneath your strongest reactions?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What fear feels more visible now than it did before?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What are you beginning to understand about the way your fear has shaped connection?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would you like to hold with more compassion in yourself going forward?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "The fear I’m learning to meet more honestly is…",
        },
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
      await prisma.day_prompts.upsert({
        where: {
          day_id_prompt_order: {
            day_id: createdDay.id,
            prompt_order: prompt.prompt_order,
          },
        },
        update: {
          type: prompt.type,
          label: prompt.label,
          content: prompt.content,
          is_published: true,
        },
        create: {
          day_id: createdDay.id,
          prompt_order: prompt.prompt_order,
          type: prompt.type,
          label: prompt.label,
          content: prompt.content,
          is_published: true,
        },
      });
    }
  }
}