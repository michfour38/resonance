import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_ID = "seed-admin-profile";
const MEMBER_ID = "seed-member-profile";

const COHORT_NAME = "Seed Test Cohort";
const CIRCLE_NAME = "Seed Test Circle";
const POST_CONTENT = "Seeded moderation test post";
const REPORT_REASON = "Seeded moderation test report pending";

async function main() {
  await prisma.report.deleteMany({
    where: {
      OR: [
        { reason: REPORT_REASON },
        { reporterId: ADMIN_ID },
        { reporterId: MEMBER_ID },
        { reportedUserId: ADMIN_ID },
        { reportedUserId: MEMBER_ID },
      ],
    },
  });

  await prisma.circlePost.deleteMany({
    where: { content: POST_CONTENT },
  });

  await prisma.circleMember.deleteMany({
    where: {
      userId: { in: [ADMIN_ID, MEMBER_ID] },
    },
  });

  await prisma.cohortMember.deleteMany({
    where: {
      userId: { in: [ADMIN_ID, MEMBER_ID] },
    },
  });

  await prisma.circle.deleteMany({
    where: { name: CIRCLE_NAME },
  });

  await prisma.cohort.deleteMany({
    where: { name: COHORT_NAME },
  });

  await prisma.profile.deleteMany({
    where: {
      id: { in: [ADMIN_ID, MEMBER_ID] },
    },
  });

  const admin = await prisma.profile.create({
    data: {
      id: ADMIN_ID,
      displayName: "Seed Admin",
      pathway: "discover",
      journeyStatus: "active",
      onboardingDone: true,
      isAdmin: true,
      timezone: "Africa/Johannesburg",
    },
  });

  const member = await prisma.profile.create({
    data: {
      id: MEMBER_ID,
      displayName: "Seed Member",
      pathway: "discover",
      journeyStatus: "active",
      onboardingDone: true,
      isAdmin: false,
      timezone: "Africa/Johannesburg",
    },
  });

  const cohort = await prisma.cohort.create({
    data: {
      name: COHORT_NAME,
      pathway: "discover",
      startAt: new Date(),
      status: "active",
      maxMembers: 96,
    },
  });

  await prisma.cohortMember.createMany({
    data: [
      {
        cohortId: cohort.id,
        userId: admin.id,
        status: "active",
        activatedAt: new Date(),
      },
      {
        cohortId: cohort.id,
        userId: member.id,
        status: "active",
        activatedAt: new Date(),
      },
    ],
  });

  const circle = await prisma.circle.create({
    data: {
      cohortId: cohort.id,
      name: CIRCLE_NAME,
      facilitatorId: admin.id,
    },
  });

  await prisma.circleMember.createMany({
    data: [
      {
        circleId: circle.id,
        userId: admin.id,
        role: "facilitator",
      },
      {
        circleId: circle.id,
        userId: member.id,
        role: "member",
      },
    ],
  });

  const post = await prisma.circlePost.create({
    data: {
      circleId: circle.id,
      userId: member.id,
      content: POST_CONTENT,
    },
  });

  const report = await prisma.report.create({
    data: {
      reporterId: admin.id,
      reportedUserId: member.id,
      reportedPostId: post.id,
      reason: REPORT_REASON,
      status: "pending",
    },
  });

  console.log({
    adminId: admin.id,
    memberId: member.id,
    cohortId: cohort.id,
    circleId: circle.id,
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