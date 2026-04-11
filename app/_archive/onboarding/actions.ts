"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function completeOnboarding() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: {
      id: true,
      onboarding_done: true,
    },
  });

  if (!profile || !profile.onboarding_done) {
    redirect("/onboarding/welcome");
  }

  const existing = await prisma.circle_members.findFirst({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
    },
  });

  if (existing) redirect("/home");

  const circles = await prisma.circles.findMany({
    select: {
      id: true,
      created_at: true,
      _count: {
        select: {
          circle_members: true,
        },
      },
    },
  });

  if (circles.length === 0) redirect("/onboarding");

  const circle = circles.sort((a, b) => {
    if (a._count.circle_members !== b._count.circle_members) {
      return a._count.circle_members - b._count.circle_members;
    }
    return a.created_at.getTime() - b.created_at.getTime();
  })[0];

  await prisma.circle_members.create({
    data: {
      circle_id: circle.id,
      user_id: userId,
      role: "member",
    },
  });

  redirect("/home");
}