"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth/require-admin";

function revalidateModerationPaths(postId?: string) {
  revalidatePath("/moderation");
  if (postId) {
    revalidatePath(`/moderation/posts/${postId}`);
  }
}

export async function reviewReportAction(formData: FormData): Promise<void> {
  const { clerkUserId } = await requireAdminAction();

  const reportId = String(formData.get("reportId") ?? "");
  if (!reportId) {
    throw new Error("Missing reportId");
  }

  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "reviewed",
      reviewedAt: new Date(),
      reviewedBy: clerkUserId,
    },
    select: {
      reportedPostId: true,
    },
  });

  revalidateModerationPaths(report.reportedPostId ?? undefined);
}

export async function dismissReportAction(formData: FormData): Promise<void> {
  const { clerkUserId } = await requireAdminAction();

  const reportId = String(formData.get("reportId") ?? "");
  if (!reportId) {
    throw new Error("Missing reportId");
  }

  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "dismissed",
      reviewedAt: new Date(),
      reviewedBy: clerkUserId,
    },
    select: {
      reportedPostId: true,
    },
  });

  revalidateModerationPaths(report.reportedPostId ?? undefined);
}

export async function markActionTakenReportAction(formData: FormData): Promise<void> {
  const { clerkUserId } = await requireAdminAction();

  const reportId = String(formData.get("reportId") ?? "");
  if (!reportId) {
    throw new Error("Missing reportId");
  }

  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "action_taken",
      reviewedAt: new Date(),
      reviewedBy: clerkUserId,
    },
    select: {
      reportedPostId: true,
    },
  });

  revalidateModerationPaths(report.reportedPostId ?? undefined);
}

export async function removePostAction(formData: FormData): Promise<void> {
  const { clerkUserId } = await requireAdminAction();

  const postId = String(formData.get("postId") ?? "");
  if (!postId) {
    throw new Error("Missing postId");
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.circlePost.update({
      where: { id: postId },
      data: {
        deletedAt: now,
      },
    }),
    prisma.report.updateMany({
      where: {
        reportedPostId: postId,
        status: "pending",
      },
      data: {
        status: "action_taken",
        reviewedAt: now,
        reviewedBy: clerkUserId,
      },
    }),
  ]);

  revalidateModerationPaths(postId);
}