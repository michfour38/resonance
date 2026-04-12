import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAdminPage(): Promise<{ clerkUserId: string }> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: { is_admin: true },
  });

  if (!profile?.is_admin) {
    redirect("/");
  }

  return { clerkUserId: userId };
}

export async function requireAdminAction(): Promise<{ clerkUserId: string }> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: { is_admin: true },
  });

  if (!profile?.is_admin) {
    throw new Error("Forbidden");
  }

  return { clerkUserId: userId };
}