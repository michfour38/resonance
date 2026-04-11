import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const member = await prisma.profile.findUnique({
    where: { id: "seed-member-profile" },
  });

  if (!member) {
    throw new Error("seed-member-profile not found. Run seed first.");
  }

  const post = await prisma.circlePost.findFirst({
    where: {
      userId: member.id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!post) {
    throw new Error("No active post found for seed-member-profile. Run seed first.");
  }

  const report = await prisma.report.create({
    data: {
      reporterId: "seed-admin-profile",
      reportedUserId: member.id,
      reportedPostId: post.id,
      reason: "Manual test report from script",
      status: "pending",
    },
  });

  console.log({
    postId: post.id,
    reportId: report.id,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });