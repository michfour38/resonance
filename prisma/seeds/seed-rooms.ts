import { PrismaClient } from "@prisma/client";
import roomsConfig from "../../config/rooms.json";

const prisma = new PrismaClient();

type RoomJson = {
  slug: string;
  name: string;
  weekNumber: number;
  theme: string;
  isIntegration: boolean;
};

export async function seedRooms() {
  const rooms = [...roomsConfig.rooms]
    .sort((a, b) => a.weekNumber - b.weekNumber)
    .map((room) => room as RoomJson);

  for (const room of rooms) {
    await prisma.rooms.upsert({
      where: { slug: room.slug },
      update: {
        name: room.name,
        week_number: room.weekNumber,
        theme: room.theme,
        is_integration: room.isIntegration,
      },
      create: {
        slug: room.slug,
        name: room.name,
        week_number: room.weekNumber,
        theme: room.theme,
        is_integration: room.isIntegration,
      },
    });
  }

  console.log("Done: seed-rooms.ts → seedRooms");
}