import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek4() {
  const week = await prisma.journey_weeks.upsert({
    where: { week_number: 4 },
    update: {
      title: "The Compass",
      theme: "Values & direction",
      room_slug: "compass",
      room_name: "The Compass",
      room_description:
        "The deeper values and orientation that shape how you move in love and connection.",
      is_published: true,
    },
    create: {
      week_number: 4,
      title: "The Compass",
      theme: "Values & direction",
      room_slug: "compass",
      room_name: "The Compass",
      room_description:
        "The deeper values and orientation that shape how you move in love and connection.",
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
            "What matters most to you in the way you love, relate, and build trust?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "Which values feel non-negotiable for you in a meaningful connection?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "Where do you feel most aligned with yourself in the way you relate?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of relationship direction feels true to who you are becoming?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "At my core, what matters most to me in connection is…",
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
            "Where in your life do you feel pulled in more than one direction relationally?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "When desire and discernment pull against each other, which one do you tend to follow first?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What usually happens when you ignore what you know is true for you?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "How easy is it for you to choose alignment over chemistry, urgency, or comfort?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "I tend to lose my direction when…",
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
            "What kind of future are you actually moving toward in the way you relate?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "Do your current relational habits support that future, or pull against it?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What would change if you related from deeper intention rather than momentary feeling?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of life direction do you want your relationships to support, not distract from?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "The direction I want my relationships to move me toward is…",
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
            "What values do you speak about most easily, and which values do you actually live most consistently?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "Where is there a gap between what you say you want and how you actually show up?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What value do you most want to be recognised for, and do you embody it under pressure?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of relational integrity feels hardest to hold when you’re emotional, attracted, or uncertain?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "A value I want to live more fully in relationship is…",
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
            "What helps you recognise when something is deeply right for you, not just exciting or familiar?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "How do you tell the difference between a true yes and a hopeful yes?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "When have you overridden your own knowing in relationship, and why?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would trusting your own inner compass require from you right now?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "When something is truly aligned for me, I usually notice…",
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
            "What kind of choices help you stay loyal to yourself in connection?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What boundary, truth, or standard have you needed to clarify more honestly for yourself?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "Where are you being asked to choose clarity over confusion?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would it look like to move from self-betrayal into self-trust relationally?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "A truer direction for me in relationship would be…",
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
            "What have you learned this week about the values that actually guide you?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "Where do you feel more clear, and where do you still feel divided?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What truth feels most important to keep close as you continue this journey?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of relational direction are you now more ready to choose consciously?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "The direction I most want to stay loyal to is…",
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