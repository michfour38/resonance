"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import {
  completePrompt,
  toggleWitness,
  toggleResonated,
  upsertAnalysis,
  requestAnalysisPublic,
  withdrawAnalysisPublicRequest,
  approveAnalysisPublic,
  declineAnalysisPublic,
  makeAnalysisPrivateAgain,
} from "./journey.service";

import { getMemberWaveContext } from "../../../src/lib/wave/wave.service";
import { markWaveDayComplete } from "../../../src/lib/wave/wave.completion";

import {
  signalReaction,
  signalAnalyze,
  signalResonanceOnCompletion,
  signalDepthAlignment,
} from "../signals/signals.service";

export async function submitPromptAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const promptId = String(formData.get("promptId") ?? "");
  const response = String(formData.get("response") ?? "").trim();
  const isShared = formData.get("isShared") === "true";
  const pathwayTransition = String(formData.get("pathwayTransition") ?? "").trim();

  if (!promptId || !response) return;

  await completePrompt(promptId, userId, response, isShared);

if (pathwayTransition === "discover_to_relate") {
  await prisma.profiles.update({
    where: { id: userId },
    data: { pathway: "relate" },
  });
}

if (pathwayTransition === "relate_to_discover") {
  await prisma.profiles.update({
    where: { id: userId },
    data: { pathway: "discover" },
  });
}

  const context = await getMemberWaveContext(userId);

  if (
    context.progression.phase === "CORE" ||
    context.progression.phase === "INTEGRATION"
  ) {
    await markWaveDayComplete({
      userId,
      cohortId: context.wave.id,
      weekNumber: context.progression.weekNumber!,
      dayNumber: context.progression.dayNumber!,
    });
  }

  signalResonanceOnCompletion(userId, promptId, response);
  signalDepthAlignment(userId, promptId, response);

  revalidatePath("/journey");
  redirect("/journey");
}

export async function toggleWitnessAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const completionId = String(formData.get("completionId"));
  if (!completionId) return;

  await toggleWitness(completionId, userId);
  signalReaction(userId, completionId, "witness");

  revalidatePath("/journey");
}

export async function toggleResonatedAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const completionId = String(formData.get("completionId"));
  if (!completionId) return;

  await toggleResonated(completionId, userId);
  signalReaction(userId, completionId, "resonated");

  revalidatePath("/journey");
}

export async function submitAnalysisAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const completionId = String(formData.get("completionId"));
  const content = String(formData.get("content") ?? "").trim();

  if (!completionId || !content) return;

  await upsertAnalysis(completionId, userId, content);
  signalAnalyze(userId, completionId);

  revalidatePath("/journey");
}

export async function requestAnalysisPublicAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const analysisId = String(formData.get("analysisId"));
  if (!analysisId) return;

  await requestAnalysisPublic(analysisId, userId);
  revalidatePath("/journey");
}

export async function withdrawAnalysisPublicRequestAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const analysisId = String(formData.get("analysisId"));
  if (!analysisId) return;

  await withdrawAnalysisPublicRequest(analysisId, userId);
  revalidatePath("/journey");
}

export async function approveAnalysisPublicAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const analysisId = String(formData.get("analysisId"));
  if (!analysisId) return;

  await approveAnalysisPublic(analysisId, userId);
  revalidatePath("/journey");
}

export async function declineAnalysisPublicAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const analysisId = String(formData.get("analysisId"));
  if (!analysisId) return;

  await declineAnalysisPublic(analysisId, userId);
  revalidatePath("/journey");
}

export async function makeAnalysisPrivateAgainAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const analysisId = String(formData.get("analysisId"));
  if (!analysisId) return;

  await makeAnalysisPrivateAgain(analysisId, userId);
  revalidatePath("/journey");
}

export async function updatePathwayAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const pathway = String(formData.get("pathway") ?? "").trim();

  if (pathway !== "discover" && pathway !== "relate") return;

  await prisma.profiles.update({
    where: { id: userId },
    data: { pathway },
  });

  revalidatePath("/journey");
}