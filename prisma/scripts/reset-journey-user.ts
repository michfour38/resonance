import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USER_ID = "user_3B7b1iDrlpAQNhdQ6LUwfAZs0zT";

async function resetJourneyUser() {
  if (!USER_ID) {
    throw new Error("Set USER_ID before running this script.");
  }

  console.log(`Resetting journey data for user: ${USER_ID}`);

  const completions = await prisma.prompt_completions.findMany({
    where: { user_id: USER_ID },
    select: { id: true },
  });

  const completionIds = completions.map((c) => c.id);

  if (completionIds.length > 0) {
    const reactionsOnMyCompletions = await prisma.prompt_reactions.deleteMany({
      where: { completion_id: { in: completionIds } },
    });
    console.log(
      `  Deleted prompt_reactions on my completions: ${reactionsOnMyCompletions.count}`
    );

    const analysesOnMyCompletions = await prisma.prompt_analyses.deleteMany({
      where: { completion_id: { in: completionIds } },
    });
    console.log(
      `  Deleted prompt_analyses on my completions: ${analysesOnMyCompletions.count}`
    );
  } else {
    console.log("  No prompt_completions found for this user.");
  }

  const myReactions = await prisma.prompt_reactions.deleteMany({
    where: { user_id: USER_ID },
  });
  console.log(`  Deleted my prompt_reactions: ${myReactions.count}`);

  const myAnalyses = await prisma.prompt_analyses.deleteMany({
    where: { author_id: USER_ID },
  });
  console.log(`  Deleted my authored prompt_analyses: ${myAnalyses.count}`);

  const deletedCompletions = await prisma.prompt_completions.deleteMany({
    where: { user_id: USER_ID },
  });
  console.log(`  Deleted prompt_completions: ${deletedCompletions.count}`);

  const mirrors = await prisma.mirror_responses.deleteMany({
    where: { user_id: USER_ID },
  });
  console.log(`  Deleted mirror_responses: ${mirrors.count}`);

  const sessions = await prisma.reflection_sessions.findMany({
    where: {
      user_id: USER_ID,
      session_type: "room_reflection",
    },
    select: { id: true },
  });

  const sessionIds = sessions.map((s) => s.id);

  if (sessionIds.length > 0) {
    const messages = await prisma.reflection_messages.deleteMany({
      where: { session_id: { in: sessionIds } },
    });
    console.log(`  Deleted reflection_messages: ${messages.count}`);

    const deletedSessions = await prisma.reflection_sessions.deleteMany({
      where: { id: { in: sessionIds } },
    });
    console.log(`  Deleted reflection_sessions: ${deletedSessions.count}`);
  } else {
    console.log("  No reflection_sessions found to delete.");
  }

  console.log(`\nReset complete for user: ${USER_ID}`);
}

resetJourneyUser()
  .catch((e) => {
    console.error("Reset failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });