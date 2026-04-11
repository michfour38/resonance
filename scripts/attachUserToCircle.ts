import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  await prisma.circle_members.create({
    data: {
      id: randomUUID(),
      circle_id: "c63a9f05-6f48-4718-9b49-6e716bc97ce5",
      user_id: "seed-admin-profile",
      role: "member",
      joined_at: new Date(),
    },
  });

  console.log("✅ User attached to circle");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });