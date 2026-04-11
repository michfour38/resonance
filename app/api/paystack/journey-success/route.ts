import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect("http://localhost:3000/sign-in");
  }

  await prisma.cohort_members.updateMany({
    where: { user_id: userId },
    data: {
      activated_at: new Date(),
    },
  });

  return NextResponse.redirect("http://localhost:3000/journey");
}