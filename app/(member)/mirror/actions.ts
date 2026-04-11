"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { runMirrorSynthesis } from "./mirror.service";

export async function generateMirrorAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const weekNumber = Number(formData.get("weekNumber"));
  const dayNumber = Number(formData.get("dayNumber"));

  if (!weekNumber || !dayNumber) return;

  await runMirrorSynthesis(userId, weekNumber, dayNumber);
  revalidatePath("/journey");
}