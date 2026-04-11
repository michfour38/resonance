"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";

const ADMIN_ID = "seed-admin-profile";

async function getPostIdFromReport(reportId: string): Promise<string | null> {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { reportedPostId: true },
  });
  return report?.reportedPostId ?? null;
}

export async function reviewReportAction(formData: FormData) {
  await requireAdminAction();

  const reportId = String(formData.get("reportId"));
  const postId = await getPostIdFromReport(reportId);

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "reviewed",
      reviewedAt: new Date(),
      reviewedBy: ADMIN_ID,
    },
  });

  revalidatePath("/moderation");
  if (postId) revalidatePath(`/moderation/posts/${postId}`);
}

export async function dismissReportAction(formData: FormData) {
  await requireAdminAction();

  const reportId = String(formData.get("reportId"));
  const postId = await getPostIdFromReport(reportId);

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "dismissed",
      reviewedAt: new Date(),
      reviewedBy: ADMIN_ID,
    },
  });

  revalidatePath("/moderation");
  if (postId) revalidatePath(`/moderation/posts/${postId}`);
}

export async function markActionTakenReportAction(formData: FormData) {
  await requireAdminAction();

  const reportId = String(formData.get("reportId"));
  const postId = await getPostIdFromReport(reportId);

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "action_taken",
      reviewedAt: new Date(),
      reviewedBy: ADMIN_ID,
    },
  });

  revalidatePath("/moderation");
  if (postId) revalidatePath(`/moderation/posts/${postId}`);
}

export async function removePostAction(formData: FormData) {
  await requireAdminAction();

  const postId = String(formData.get("postId"));

  await prisma.circlePost.update({
    where: { id: postId },
    data: {
      deletedAt: new Date(),
    },
  });

  revalidatePath("/moderation");
  revalidatePath(`/moderation/posts/${postId}`);
}