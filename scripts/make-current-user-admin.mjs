import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLERK_USER_ID = "user_3AnlW4BbVPaIsjtVevVlEfGN7A5";

async function main() {
  const user = await prisma.profile.upsert({
    where: { id: CLERK_USER_ID },
    update: {
      isAdmin: true,
      displayName: "Michelle Admin",
      pathway: "discover",
      journeyStatus: "active",
      onboardingDone: true,
      timezone: "Africa/Johannesburg",
    },
    create: {
      id: CLERK_USER_ID,
      isAdmin: true,
      displayName: "Michelle Admin",
      pathway: "discover",
      journeyStatus: "active",
      onboardingDone: true,
      timezone: "Africa/Johannesburg",
    },
  });

  console.log(user);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });