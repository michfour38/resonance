import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAdminPage(): Promise<{ userId: string }> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.profiles.findUnique({
    where: { id: clerkId },
    select: { is_admin: true },
  });

  if (!user || !user.is_admin) {
    redirect("/");
  }

  return { userId: clerkId };
}

export async function requireAdminAction(): Promise<{ userId: string }> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.profiles.findUnique({
    where: { id: clerkId },
    select: { is_admin: true },
  });

  if (!user || !user.is_admin) {
    throw new Error("Forbidden");
  }

  return { userId: clerkId };
}