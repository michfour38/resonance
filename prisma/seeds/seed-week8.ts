import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek8() {
  const week = await prisma.journey_weeks.upsert({
    where: { week_number: 8 },
    update: {
      title: "The Vision",
      theme: "Conscious relationship design",
      room_slug: "vision",
      room_name: "The Vision",
      room_description:
        "The kind of relationship you want to build, and the future you want love to serve.",
      is_published: true,
    },
    create: {
      week_number: 8,
      title: "The Vision",
      theme: "Conscious relationship design",
      room_slug: "vision",
      room_name: "The Vision",
      room_description:
        "The kind of relationship you want to build, and the future you want love to serve.",
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
            "What kind of relationship do you most deeply want to create, not just experience?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What qualities would make a relationship feel deeply aligned for you?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of love feels worth building your life around?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What does a meaningful shared future feel like in your body when you imagine it?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "What I most want to co-create in love is…",
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
            "What do you want partnership to support in your life — emotionally, practically, spiritually, creatively, or otherwise?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of shared direction or purpose feels important to you?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of life becomes more possible for you in the right relationship?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What does it mean to you for a relationship to have direction, not just chemistry?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "I want love to help make possible a life that feels…",
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
            "What kind of relationship structure or rhythm feels most honest for the life you want?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What does mutuality mean to you in daily life, not just in theory?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of balance between freedom and commitment feels true for you?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would help a relationship feel intentional rather than accidental?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "The shape of relationship that feels most true for me is…",
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
            "What kind of person do you need to be in order to help create the relationship you say you want?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What patterns in you would need to keep changing for that vision to become more possible?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of responsibility belongs to you in relationship design?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of inner maturity would support the kind of love you long for?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "To help create the relationship I want, I need to become more…",
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
            "What does shared vision require beyond attraction or compatibility?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of conversations would need to be possible in the relationship you want?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What values would need to be lived, not just admired, for that vision to hold?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would help a relationship stay aligned over time rather than drift?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "For a shared vision to truly hold, it would need…",
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
            "Where are you still unclear about what you actually want in relationship?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What tension still exists between fantasy and truth in your vision of love?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What part of your vision feels most grounded, and what part still needs deeper honesty?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What are you beginning to trust more about the future you actually want?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "The clearest part of my relationship vision now is…",
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
            "What have you learned this week about the kind of love you want to build?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What feels more real now than it did before?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of shared future now feels more aligned than you previously understood?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What truth about relationship design feels most important to carry forward?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "The relationship I’m becoming more ready to create is one that…",
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