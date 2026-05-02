const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const email = process.argv[2];
const userId = process.argv[3];

if (!email || !userId) {
  console.error("Usage:");
  console.error("node scripts/clean-test-user.js test@email.com user_xxxxx");
  process.exit(1);
}

async function main() {
  console.log("Cleaning test user:");
  console.log({ email, userId });

  const sessions = await prisma.reflection_sessions.findMany({
    where: { user_id: userId },
    select: { id: true },
  });

  const sessionIds = sessions.map((s) => s.id);

  if (sessionIds.length > 0) {
    await prisma.inquiry_sessions.deleteMany({
      where: { reflection_session_id: { in: sessionIds } },
    });

    await prisma.reflection_messages.deleteMany({
      where: { session_id: { in: sessionIds } },
    });
  }

  const userPosts = await prisma.circle_posts.findMany({
    where: { user_id: userId },
    select: { id: true },
  });

  const postIds = userPosts.map((p) => p.id);

  if (postIds.length > 0) {
    await prisma.reports.deleteMany({
      where: { reported_post_id: { in: postIds } },
    });

    await prisma.post_witnesses.deleteMany({
      where: { post_id: { in: postIds } },
    });

    await prisma.circle_posts.deleteMany({
      where: { parent_id: { in: postIds } },
    });

    await prisma.circle_posts.deleteMany({
      where: { id: { in: postIds } },
    });
  }

  await prisma.reports.deleteMany({
    where: {
      OR: [
        { reporter_id: userId },
        { reported_user_id: userId },
        { reviewed_by: userId },
      ],
    },
  });

  await prisma.post_witnesses.deleteMany({ where: { user_id: userId } });
  await prisma.circle_posts.deleteMany({ where: { user_id: userId } });
  await prisma.circle_prompts.deleteMany({ where: { author_id: userId } });

  await prisma.mirror_feedback.deleteMany({ where: { user_id: userId } });
  await prisma.mirror_responses.deleteMany({ where: { user_id: userId } });
  await prisma.mirror_unlocks.deleteMany({ where: { user_id: userId } });

  await prisma.journey_day_continues.deleteMany({ where: { user_id: userId } });

  await prisma.prompt_analyses.deleteMany({ where: { author_id: userId } });
  await prisma.prompt_reactions.deleteMany({ where: { user_id: userId } });
  await prisma.prompt_completions.deleteMany({ where: { user_id: userId } });

  await prisma.journey_progress.deleteMany({ where: { user_id: userId } });
  await prisma.cohort_members.deleteMany({ where: { user_id: userId } });
  await prisma.circle_members.deleteMany({ where: { user_id: userId } });

  await prisma.journal_entries.deleteMany({ where: { user_id: userId } });
  await prisma.notifications.deleteMany({ where: { user_id: userId } });
  await prisma.reflection_sessions.deleteMany({ where: { user_id: userId } });
  await prisma.user_insights.deleteMany({ where: { user_id: userId } });

  await prisma.prewave_responses.deleteMany({ where: { user_id: userId } });
  await prisma.wave_name_votes.deleteMany({ where: { user_id: userId } });

  await prisma.circles.updateMany({
    where: { facilitator_id: userId },
    data: { facilitator_id: null },
  });

  await prisma.profiles.updateMany({
    where: { invited_by: userId },
    data: { invited_by: null },
  });

  await prisma.entry_leads.deleteMany({ where: { email } });
  await prisma.profiles.deleteMany({ where: { id: userId } });

  console.log("Done. Test user cleaned.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });