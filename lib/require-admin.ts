import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAdminPage(): Promise<{ clerkUserId: string }> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  if (!profile?.isAdmin) {
    redirect("/");
  }

  return { clerkUserId: userId };
}

export async function requireAdminAction(): Promise<{ clerkUserId: string }> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  if (!profile?.isAdmin) {
    throw new Error("Forbidden");
  }

  return { clerkUserId: userId };
}