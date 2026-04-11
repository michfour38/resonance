import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  removePostAndMarkActionTaken,
  updateReportNotes,
  updateReportStatus,
} from "./moderation.service";

// ─── Decision reason constants ────────────────────────────────────────────────

export const APPROVE_REASONS = ["NO_VIOLATION", "CONTEXT_MISSING"] as const;
export const REVIEW_REASONS = ["INCONCLUSIVE", "NEEDS_MORE_CONTEXT"] as const;
export const REMOVE_REASONS = [
  "SPAM",
  "HARASSMENT",
  "HATE",
  "SAFETY",
  "OTHER",
] as const;

export type ApproveReason = (typeof APPROVE_REASONS)[number];
export type ReviewReason = (typeof REVIEW_REASONS)[number];
export type RemoveReason = (typeof REMOVE_REASONS)[number];
export type DecisionReason = ApproveReason | ReviewReason | RemoveReason;

export const ALL_DECISION_REASONS = [
  ...APPROVE_REASONS,
  ...REVIEW_REASONS,
  ...REMOVE_REASONS,
] as const;

// ─── Note formatting ──────────────────────────────────────────────────────────

export function formatDecisionNote(
  reason: DecisionReason,
  freeText?: string | null
): string {
  const tag = `[DECISION_REASON: ${reason}]`;
  const text = freeText?.trim();
  return text ? `${tag} ${text}` : tag;
}

export function parseDecisionNote(notes: string | null): {
  reason: DecisionReason | null;
  freeText: string | null;
} {
  if (!notes) return { reason: null, freeText: null };

  const match = notes.match(/^\[DECISION_REASON:\s*([A-Z_]+)\](?:\s(.+))?$/s);
  if (!match) return { reason: null, freeText: null };

  const candidate = match[1] as DecisionReason;
  const isValid = (ALL_DECISION_REASONS as readonly string[]).includes(candidate);

  return {
    reason: isValid ? candidate : null,
    freeText: match[2]?.trim() || null,
  };
}

export function decisionReasonLabel(reason: DecisionReason): string {
  switch (reason) {
    case "NO_VIOLATION":
      return "No violation";
    case "CONTEXT_MISSING":
      return "Context missing";
    case "INCONCLUSIVE":
      return "Inconclusive";
    case "NEEDS_MORE_CONTEXT":
      return "Needs more context";
    case "SPAM":
      return "Spam";
    case "HARASSMENT":
      return "Harassment";
    case "HATE":
      return "Hate";
    case "SAFETY":
      return "Safety concern";
    case "OTHER":
      return "Other";
  }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function getRedirectStatus(formData: FormData): string {
  const raw = formData.get("redirectStatus");
  if (
    raw === "PENDING" ||
    raw === "REVIEWED" ||
    raw === "ACTION_TAKEN" ||
    raw === "DISMISSED"
  ) {
    return raw;
  }
  return "PENDING";
}

function resolveAdminNotes(formData: FormData): string | null {
  const reason = formData.get("decisionReason");
  const freeText = formData.get("decisionFreeText");

  if (!reason || typeof reason !== "string") return null;

  const isValid = (ALL_DECISION_REASONS as readonly string[]).includes(reason);
  if (!isValid) return null;

  return formatDecisionNote(
    reason as DecisionReason,
    typeof freeText === "string" ? freeText : null
  );
}

async function requireModeratorProfileId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized.");
  }

  const profile = await prisma.profiles.findFirst({
    where: { id: userId },
    select: { id: true },
  });

  if (profile) {
    return profile.id;
  }

  const fallbackAdminProfile = await prisma.profiles.findFirst({
    where: { is_admin: true },
    orderBy: { created_at: "asc" },
    select: { id: true },
  });

  if (fallbackAdminProfile) {
    return fallbackAdminProfile.id;
  }

  throw new Error("No moderator profile found.");
}

// ─── Server actions ───────────────────────────────────────────────────────────

export async function approveReportAction(formData: FormData): Promise<void> {
  "use server";

  const reportId = String(formData.get("reportId") ?? "");
  const redirectStatus = getRedirectStatus(formData);
  const reviewedByProfileId = await requireModeratorProfileId();

  if (!reportId) throw new Error("Missing reportId.");

  const notes = resolveAdminNotes(formData);
  if (notes) {
    await updateReportNotes(reportId, notes);
  }

  await updateReportStatus(reportId, "DISMISSED", reviewedByProfileId);
  revalidatePath("/admin/moderation");
  revalidatePath(`/admin/moderation/${reportId}`);
  redirect(`/admin/moderation?status=${redirectStatus}`);
}

export async function markReviewedAction(formData: FormData): Promise<void> {
  "use server";

  const reportId = String(formData.get("reportId") ?? "");
  const redirectStatus = getRedirectStatus(formData);
  const reviewedByProfileId = await requireModeratorProfileId();

  if (!reportId) throw new Error("Missing reportId.");

  const notes = resolveAdminNotes(formData);
  if (notes) {
    await updateReportNotes(reportId, notes);
  }

  await updateReportStatus(reportId, "REVIEWED", reviewedByProfileId);
  revalidatePath("/admin/moderation");
  revalidatePath(`/admin/moderation/${reportId}`);
  redirect(`/admin/moderation?status=${redirectStatus}`);
}

export async function removePostAction(formData: FormData): Promise<void> {
  "use server";

  const reportId = String(formData.get("reportId") ?? "");
  const postId = String(formData.get("postId") ?? "");
  const redirectStatus = getRedirectStatus(formData);
  const reviewedByProfileId = await requireModeratorProfileId();

  if (!reportId) throw new Error("Missing reportId.");
  if (!postId) throw new Error("Missing postId.");

  const notes = resolveAdminNotes(formData);
  if (notes) {
    await updateReportNotes(reportId, notes);
  }

  await removePostAndMarkActionTaken(reportId, postId, reviewedByProfileId);
  revalidatePath("/admin/moderation");
  revalidatePath(`/admin/moderation/${reportId}`);
  redirect(`/admin/moderation?status=${redirectStatus}`);
}

export async function saveModeratorNotesAction(
  formData: FormData
): Promise<void> {
  "use server";

  const reportId = String(formData.get("reportId") ?? "");
  const notes = String(formData.get("notes") ?? "");

  if (!reportId) throw new Error("Missing reportId.");

  await updateReportNotes(reportId, notes);
  revalidatePath("/admin/moderation");
  revalidatePath(`/admin/moderation/${reportId}`);
  redirect(`/admin/moderation/${reportId}`);
}