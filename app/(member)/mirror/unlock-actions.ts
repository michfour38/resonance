"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unlockMirrorTier } from "./mirror-unlock.service";

export async function unlockLiteMirrorAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const weekNumber = Number(formData.get("weekNumber"));
  const dayNumber = Number(formData.get("dayNumber"));

  if (!weekNumber || !dayNumber) {
    redirect("/journey");
  }

  await unlockMirrorTier({
    userId,
    weekNumber,
    dayNumber,
    tier: "lite",
    isPaid: true,
  });

  redirect("/journey");
}

export async function unlockFullMirrorAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const weekNumber = Number(formData.get("weekNumber"));
  const dayNumber = Number(formData.get("dayNumber"));

  if (!weekNumber || !dayNumber) {
    redirect("/journey");
  }

  await unlockMirrorTier({
    userId,
    weekNumber,
    dayNumber,
    tier: "full",
    isPaid: true,
  });

  redirect("/journey");
}