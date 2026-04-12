"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";

async function getPostIdFromReport(reportId: string): Promise<string | null> {
  const report = await prisma.reports.findUnique({
    where: { id: reportId },
    select: { reported_post_id: true },
  });

  return report?.reported_post_id ?? null;
}

export async function reviewReportAction(formData: FormData) {
  const { userId } = await requireAdminAction();

  const reportId = String(formData.get("reportId") ?? "");
  const postId = await getPostIdFromReport(reportId);

  await prisma.reports.update({
    where: { id: reportId },
    data: {
      status: "reviewed",
      reviewed_at: new Date(),
      reviewed_by: userId,
    },
  });

  revalidatePath("/moderation");
  if (postId) revalidatePath(`/moderation/posts/${postId}`);
}

export async function dismissReportAction(formData: FormData) {
  const { userId } = await requireAdminAction();

  const reportId = String(formData.get("reportId") ?? "");
  const postId = await getPostIdFromReport(reportId);

  await prisma.reports.update({
    where: { id: reportId },
    data: {
      status: "dismissed",
      reviewed_at: new Date(),
      reviewed_by: userId,
    },
  });

  revalidatePath("/moderation");
  if (postId) revalidatePath(`/moderation/posts/${postId}`);
}

export async function markActionTakenReportAction(formData: FormData) {
  const { userId } = await requireAdminAction();

  const reportId = String(formData.get("reportId") ?? "");
  const postId = await getPostIdFromReport(reportId);

  await prisma.reports.update({
    where: { id: reportId },
    data: {
      status: "action_taken",
      reviewed_at: new Date(),
      reviewed_by: userId,
    },
  });

  revalidatePath("/moderation");
  if (postId) revalidatePath(`/moderation/posts/${postId}`);
}

export async function removePostAction(formData: FormData) {
  await requireAdminAction();

  const postId = String(formData.get("postId") ?? "");

  await prisma.circle_posts.update({
    where: { id: postId },
    data: {
      deleted_at: new Date(),
    },
  });

  revalidatePath("/moderation");
  revalidatePath(`/moderation/posts/${postId}`);
}