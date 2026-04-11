import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek9() {
  const room = await prisma.rooms.upsert({
    where: { slug: "the-gathering" },
    update: {
      name: "The Gathering",
      week_number: 9,
      theme: "Gathering what has shifted",
      is_integration: true,
    },
    create: {
      slug: "the-gathering",
      name: "The Gathering",
      week_number: 9,
      theme: "Gathering what has shifted",
      is_integration: true,
    },
  });

  const week = await prisma.journey_weeks.upsert({
    where: { week_number: 9 },
    update: {
      room_id: room.id,
      title: "The Gathering",
      theme: "Gathering what has shifted",
      is_published: true,
    },
    create: {
      room_id: room.id,
      week_number: 9,
      title: "The Gathering",
      theme: "Gathering what has shifted",
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
            "Looking back across the past weeks, what feels most different in how you now understand yourself?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content: "What pattern or truth has become hardest to ignore?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What has shifted in the way you see your role in connection?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What feels more honest in you now than it did at the beginning?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "What has become clearer in me is…",
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
            "What have you learned about what helps you open, and what causes you to close?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What relational pattern now makes more sense to you than before?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What do you now understand about the way you protect yourself?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What truth about your needs, fears, or values feels more integrated now?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "What I understand more deeply about my relational self is…",
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
            "What room or week in this journey feels like it changed you the most, and why?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What moment, insight, or reflection has stayed with you most strongly?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What part of the journey challenged you more than you expected?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What part of the journey felt most like coming home to yourself?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "The part of this journey that most changed me was…",
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
            "What are you beginning to trust more about yourself in connection?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What now feels more possible in relationship than it once did?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of clarity are you carrying now that you didn’t have before?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would it mean to keep living from that clarity beyond this week?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "What I’m learning to trust in myself is…",
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
            "What are you still in the process of understanding about yourself?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What still feels unresolved, unfinished, or tender in you?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What truth are you not ready to rush, but no longer want to avoid?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What deserves more time, patience, or witnessing in your journey forward?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "What is still quietly unfolding in me is…",
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
            "What are you becoming more committed to in the way you relate?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What old way of moving in relationship are you less willing to return to?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of future self feels more available to you now?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would it look like to continue this journey with sincerity beyond the structure of the app?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "What I want to carry forward from this journey is…",
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
            "What feels most important to honour about who you are now?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What feels worthy of being integrated, not forgotten?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What truth from this journey feels most alive in you today?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "As you look ahead, what do you most want to stay loyal to in yourself?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "The truth I want to keep living from is…",
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