import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedWeek7() {
  const week = await prisma.journey_weeks.upsert({
    where: { week_number: 7 },
    update: {
      title: "The Forge",
      theme: "Conflict & repair",
      room_slug: "forge",
      room_name: "The Forge",
      room_description:
        "The heat of conflict, the strain of rupture, and the possibility of repair.",
      is_published: true,
    },
    create: {
      week_number: 7,
      title: "The Forge",
      theme: "Conflict & repair",
      room_slug: "forge",
      room_name: "The Forge",
      room_description:
        "The heat of conflict, the strain of rupture, and the possibility of repair.",
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
            "What usually happens inside you when tension starts to build with someone?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "Do you move toward conflict, avoid it, soften it, control it, or something else?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What part of conflict feels most difficult for you — being misunderstood, losing control, hurting someone, being hurt, or something else?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What does conflict tend to awaken in you emotionally?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "When conflict begins, I usually feel…",
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
            "What pattern do you tend to repeat when you feel defensive?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "How do you usually protect yourself when you feel blamed or exposed?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What happens to your listening when you’re hurt or activated?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "How do your protective responses affect the possibility of repair?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "When I feel attacked, I usually protect myself by…",
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
            "What kind of conflict tends to stay with you long after it’s over?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What makes something feel unresolved for you?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What do you tend to long for most during rupture — understanding, accountability, reassurance, space, honesty, repair, or something else?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What has made repair feel possible for you in the past?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "For repair to feel real for me, I usually need…",
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
            "When have you struggled to own your part in a conflict, and why?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What tends to get in the way of accountability for you — shame, fear, pride, confusion, self-protection, or something else?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "How do you know the difference between guilt, shame, and honest responsibility?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would it look like to take responsibility without collapsing or defending?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "The part of accountability that feels hardest for me is…",
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
            "What helps you stay honest and connected in hard conversations?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of communication makes repair more possible for you?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of tone or posture helps you remain open during tension?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What are you learning about what mature repair actually requires?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "What helps me stay more open in conflict is…",
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
            "Where in your life are you being invited to handle conflict differently than before?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What old conflict pattern are you most ready to outgrow?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of repair do you want to become more capable of giving and receiving?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What would it mean for conflict to become a place of truth rather than just threat?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "A new way I want to move through conflict is…",
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
            "What have you learned this week about how you move through conflict?",
        },
        {
          prompt_order: 2,
          type: "thread_prompt",
          label: "",
          content:
            "What makes repair feel possible or impossible for you?",
        },
        {
          prompt_order: 3,
          type: "thread_prompt",
          label: "",
          content:
            "What truth about your conflict style feels clearer now?",
        },
        {
          prompt_order: 4,
          type: "thread_prompt",
          label: "",
          content:
            "What kind of relational maturity are you being invited into next?",
        },
        {
          prompt_order: 5,
          type: "mirror_exercise",
          label: "",
          content:
            "What I’m beginning to forge in myself through conflict is…",
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