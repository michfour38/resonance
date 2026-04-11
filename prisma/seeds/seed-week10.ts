import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek10() {
  const room = await prisma.rooms.upsert({
    where: { slug: "the-becoming" },
    update: {
      name: "The Becoming",
      week_number: 10,
      theme: "Embodiment & continuation",
      is_integration: true,
    },
    create: {
      slug: "the-becoming",
      name: "The Becoming",
      week_number: 10,
      theme: "Embodiment & continuation",
      is_integration: true,
    },
  });

  const week = await prisma.journey_weeks.upsert({
    where: { week_number: 10 },
    update: {
      room_id: room.id,
      title: "The Becoming",
      theme: "Embodiment & continuation",
      is_published: true,
    },
    create: {
      room_id: room.id,
      week_number: 10,
      title: "The Becoming",
      theme: "Embodiment & continuation",
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
            "What does it mean for you to actually live what you’ve come to see about yourself?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What would embodiment of your insights look like in everyday life?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "Where are you most likely to forget what you’ve learned, and why?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would help you stay connected to what feels true for you now?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "To embody what I’ve learned, I would need to…",
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
            "What kind of environment or relationships support you in staying aligned?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of environments or dynamics pull you away from yourself?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What would it mean to choose environments more consciously?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of relational spaces do you want to place yourself in more intentionally?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "I stay more aligned with myself when I am in environments that…",
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
            "What boundaries or standards now feel more necessary than before?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content: "Where do you still find it hard to hold your own line?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What would it look like to honour yourself more consistently in relationship?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content: "What kind of self-loyalty are you being asked to deepen?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "To stay more loyal to myself, I need to…",
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
            "What kind of relationships do you now feel more able to move toward or away from?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content: "What are you no longer willing to participate in?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What are you more ready to choose, even if it feels unfamiliar?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content: "What kind of courage is being asked of you now?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "The choice I feel more ready to make now is…",
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
            "What practices or habits would help you stay connected to your truth over time?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of reflection or check-in would support you beyond this structured journey?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What rhythm of self-awareness would feel sustainable in your life?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What does ongoing growth actually look like for you, not just in theory?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "To stay connected to myself over time, I want to…",
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
            "What are you most proud of in the way you have shown up for this journey?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content: "What felt hardest, and what did you do with that difficulty?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What part of yourself have you stayed with more honestly than before?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What does it mean for you to recognise your own effort and sincerity?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "What I want to acknowledge in myself is…",
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
            "As this structured journey closes, what do you feel is most important to carry forward?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What would it mean for this to be a beginning, not an ending?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of relationship with yourself do you want to keep building?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What truth about yourself feels most worth staying close to?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content: "What I’m choosing to carry forward into my life is…",
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