import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MY_USER_ID = "user_3AnlW4BbVPaIsjtVevVlEfGN7A5";
const POST_CONTENT = "Michelle self-report test post";

async function main() {
  const circle = await prisma.circle.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!circle) {
    throw new Error("No circle found");
  }

  const existingMember = await prisma.circleMember.findFirst({
    where: {
      circleId: circle.id,
      userId: MY_USER_ID,
    },
  });

  if (!existingMember) {
    await prisma.circleMember.create({
      data: {
        circleId: circle.id,
        userId: MY_USER_ID,
        role: "member",
      },
    });
  }

  const post = await prisma.circlePost.create({
    data: {
      circleId: circle.id,
      userId: MY_USER_ID,
      content: POST_CONTENT,
    },
  });

  console.log({
    circleId: circle.id,
    postId: post.id,
    content: post.content,
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