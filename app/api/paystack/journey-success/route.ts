import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  await prisma.cohort_members.updateMany({
    where: {
      user_id: userId,
      status: {
        in: ["enrolled", "active"],
      },
    },
    data: {
      status: "active",
      activated_at: new Date(),
    },
  });

  return NextResponse.redirect(new URL("/journey", request.url));
}