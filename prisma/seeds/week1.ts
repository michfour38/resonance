import { PrismaClient, PromptType } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Week 1 Content ───────────────────────────────────────────────────────────

const WEEK_1_DAYS: {
  dayNumber: number;
  prompts: {
    type: PromptType;
    promptOrder: number;
    label: string | null;
    content: string;
  }[];
}[] = [
  {
    dayNumber: 1,
    prompts: [
      {
        type: "thread_prompt",
        promptOrder: 1,
        label: null,
        content:
          "What helps you feel welcome in a new space, even before anyone says much?",
      },
      {
        type: "thread_prompt",
        promptOrder: 2,
        label: null,
        content:
          "When you enter an unfamiliar group, what do you usually notice first?",
      },
      {
        type: "thread_prompt",
        promptOrder: 3,
        label: null,
        content:
          "What part of you tends to arrive first in new spaces: your openness, your caution, your humor, your quiet, something else?",
      },
      {
        type: "thread_prompt",
        promptOrder: 4,
        label: null,
        content: "What makes it easier for you to settle around people?",
      },
      {
        type: "mirror_exercise",
        promptOrder: 5,
        label: "Mirror — Day 1",
        content:
          "Think about a time you felt unexpectedly at ease somewhere.\n\nWrite about what allowed your body or mind to soften there. Was it something in the environment, the energy of another person, or something you gave yourself permission to do?\n\nThen notice: do you usually wait for safety, or do you know how to help create it for yourself?",
      },
    ],
  },
  {
    dayNumber: 2,
    prompts: [
      {
        type: "thread_prompt",
        promptOrder: 1,
        label: null,
        content:
          "What do you tend to protect when you do not yet know whether a space is safe?",
      },
      {
        type: "thread_prompt",
        promptOrder: 2,
        label: null,
        content:
          "What is one thing people often misunderstand about your quietness, distance, humor, or friendliness?",
      },
      {
        type: "thread_prompt",
        promptOrder: 3,
        label: null,
        content:
          "How do you usually tell that you are still \"holding back\" around others?",
      },
      {
        type: "thread_prompt",
        promptOrder: 4,
        label: null,
        content:
          "What do you rarely reveal early, even when you want connection?",
      },
      {
        type: "mirror_exercise",
        promptOrder: 5,
        label: "Mirror — Day 2",
        content:
          "Complete this gently and honestly:\n\n\"One way I manage uncertainty around people is…\"\n\nThen continue:\n\"What that protects is…\"\n\"What it sometimes costs me is…\"\n\nDo not try to fix it. Just name the pattern clearly.",
      },
    ],
  },
  {
    dayNumber: 3,
    prompts: [
      {
        type: "thread_prompt",
        promptOrder: 1,
        label: null,
        content:
          "What kind of presence in another person helps you relax a little?",
      },
      {
        type: "thread_prompt",
        promptOrder: 2,
        label: null,
        content: "What feels more meaningful to you than charm?",
      },
      {
        type: "thread_prompt",
        promptOrder: 3,
        label: null,
        content: "When do you feel most seen accurately by others?",
      },
      {
        type: "thread_prompt",
        promptOrder: 4,
        label: null,
        content:
          "What is a small sign that tells you someone is emotionally safe to be around?",
      },
      {
        type: "mirror_exercise",
        promptOrder: 5,
        label: "Mirror — Day 3",
        content:
          "Write about the difference between being noticed, being understood, and being received.\n\nWhich one matters most to you right now?\nWhere in your life do you get too little of it?\nWhere do you quietly long for more?",
      },
    ],
  },
  {
    dayNumber: 4,
    prompts: [
      {
        type: "thread_prompt",
        promptOrder: 1,
        label: null,
        content:
          "What makes a conversation feel real to you instead of polite?",
      },
      {
        type: "thread_prompt",
        promptOrder: 2,
        label: null,
        content:
          "What kind of questions help you open, and what kind make you withdraw?",
      },
      {
        type: "thread_prompt",
        promptOrder: 3,
        label: null,
        content:
          "What do you appreciate in people who make room for others well?",
      },
      {
        type: "thread_prompt",
        promptOrder: 4,
        label: null,
        content:
          "What does emotional gentleness look like to you in ordinary interaction?",
      },
      {
        type: "mirror_exercise",
        promptOrder: 5,
        label: "Mirror — Day 4",
        content:
          "Reflect on this:\n\nWhen someone wants to know you, what pace feels safe for you?\n\nWrite about the speed at which you naturally open. Do people usually move too fast, too slowly, or unpredictably for you?\n\nWhat happens inside you when the pace is wrong?",
      },
    ],
  },
  {
    dayNumber: 5,
    prompts: [
      {
        type: "thread_prompt",
        promptOrder: 1,
        label: null,
        content:
          "What part of yourself do you wish felt easier to bring into a group?",
      },
      {
        type: "thread_prompt",
        promptOrder: 2,
        label: null,
        content:
          "Where do you most often feel the tension between wanting to belong and wanting to stay protected?",
      },
      {
        type: "thread_prompt",
        promptOrder: 3,
        label: null,
        content:
          "What do you hope people sense about you beyond how you first appear?",
      },
      {
        type: "thread_prompt",
        promptOrder: 4,
        label: null,
        content:
          "What kind of acceptance feels real to you, not just polite inclusion?",
      },
      {
        type: "mirror_exercise",
        promptOrder: 5,
        label: "Mirror — Day 5",
        content:
          "Write two short paragraphs:\n\nIn the first, describe the version of you that knows how to adapt and fit in.\nIn the second, describe the version of you that wants to be met without performing.\n\nThen ask yourself: which version has been carrying more of your relationships lately?",
      },
    ],
  },
  {
    dayNumber: 6,
    prompts: [
      {
        type: "thread_prompt",
        promptOrder: 1,
        label: null,
        content:
          "What makes trust begin for you: consistency, warmth, honesty, time, something else?",
      },
      {
        type: "thread_prompt",
        promptOrder: 2,
        label: null,
        content:
          "What breaks trust fastest for you, even in small ways?",
      },
      {
        type: "thread_prompt",
        promptOrder: 3,
        label: null,
        content:
          "How do you usually respond when someone surprises you with genuine care?",
      },
      {
        type: "thread_prompt",
        promptOrder: 4,
        label: null,
        content:
          "What do you need in order to believe someone's presence is sincere?",
      },
      {
        type: "mirror_exercise",
        promptOrder: 5,
        label: "Mirror — Day 6",
        content:
          "Think of a relationship, past or present, where trust grew slowly but genuinely.\n\nWhat made it possible?\nNow think of one where you stayed unsure. What remained missing?\n\nWithout blaming anyone, name the conditions under which your trust actually grows.",
      },
    ],
  },
  {
    dayNumber: 7,
    prompts: [
      {
        type: "thread_prompt",
        promptOrder: 1,
        label: null,
        content:
          "At this stage of your life, what does belonging mean to you now?",
      },
      {
        type: "thread_prompt",
        promptOrder: 2,
        label: null,
        content:
          "Do you feel more nourished by being welcomed, by being understood, or by being chosen? Why?",
      },
      {
        type: "thread_prompt",
        promptOrder: 3,
        label: null,
        content:
          "What kind of space brings out a more honest version of you?",
      },
      {
        type: "thread_prompt",
        promptOrder: 4,
        label: null,
        content:
          "What would it feel like to belong somewhere without shrinking or proving anything?",
      },
      {
        type: "mirror_exercise",
        promptOrder: 5,
        label: "Mirror — Day 7",
        content:
          "Return to yourself at the end of this week and complete these lines slowly:\n\n\"I feel safest when…\"\n\"I feel least like myself when…\"\n\"A space becomes more real for me when…\"\n\"This week reminded me that I…\"\n\nThen write one final truth:\nWhat does your heart actually need in order to stay present, not just appear present?",
      },
    ],
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seedWeek1() {
  console.log("Seeding Week 1 — The Hearth...");

  // Find the room for Week 1 by week_number
  const room = await prisma.rooms.findFirst({
    where: { week_number: 1 },
    select: { id: true, name: true },
  });

  if (!room) {
    throw new Error(
      "No room found with week_number = 1. Please ensure the rooms table has a record for Week 1 before seeding."
    );
  }

  console.log(`Found room: ${room.name} (${room.id})`);

  // Upsert journey_weeks
  const week = await prisma.journey_weeks.upsert({
    where: { week_number: 1 },
    update: {
      title: "The Hearth",
      theme: "belonging & relational safety",
      is_published: true,
    },
    create: {
      room_id: room.id,
      week_number: 1,
      title: "The Hearth",
      theme: "belonging & relational safety",
      is_published: true,
    },
  });

  console.log(`Upserted journey_weeks row: ${week.id}`);

  // Upsert each day and its prompts
  for (const day of WEEK_1_DAYS) {
    const journeyDay = await prisma.journey_days.upsert({
      where: {
        week_id_day_number: {
          week_id: week.id,
          day_number: day.dayNumber,
        },
      },
      update: {},
      create: {
        week_id: week.id,
        day_number: day.dayNumber,
      },
    });

    console.log(`  Upserted day ${day.dayNumber}: ${journeyDay.id}`);

    for (const prompt of day.prompts) {
      // Find existing prompt by day + order to allow upsert-by-position
      const existing = await prisma.day_prompts.findFirst({
        where: {
          day_id: journeyDay.id,
          prompt_order: prompt.promptOrder,
        },
        select: { id: true },
      });

      if (existing) {
        await prisma.day_prompts.update({
          where: { id: existing.id },
          data: {
            type: prompt.type,
            label: prompt.label,
            content: prompt.content,
            is_published: true,
          },
        });
      } else {
        await prisma.day_prompts.create({
          data: {
            day_id: journeyDay.id,
            type: prompt.type,
            prompt_order: prompt.promptOrder,
            label: prompt.label,
            content: prompt.content,
            is_published: true,
          },
        });
      }

      console.log(
        `    Upserted prompt order ${prompt.promptOrder} (${prompt.type})`
      );
    }
  }

  console.log("Week 1 seed complete.");
}

seedWeek1()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
