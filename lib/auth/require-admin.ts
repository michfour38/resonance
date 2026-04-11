import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAdminPage(): Promise<{ userId: string }> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.profile.findUnique({
    where: { id: clerkId },
    select: { isAdmin: true },
  });

  if (!user || !user.isAdmin) {
    redirect("/");
  }

  return { userId: clerkId };
}

export async function requireAdminAction(): Promise<{ userId: string }> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.profile.findUnique({
    where: { id: clerkId },
    select: { isAdmin: true },
  });

  if (!user || !user.isAdmin) {
    throw new Error("Forbidden");
  }

  return { userId: clerkId };
}