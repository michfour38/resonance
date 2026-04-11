"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export async function reportPostAction(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const reportedPostId = String(formData.get("reportedPostId"));
  const reportedUserId = String(formData.get("reportedUserId"));
  const reason = String(formData.get("reason"));

  if (!reportedPostId || !reason) {
    throw new Error("Missing required report fields");
  }

  // ensure profile exists (production-safe)
  const profile = await prisma.profile.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      displayName: "New User",
      pathway: "discover",
      journeyStatus: "active",
      onboardingDone: true,
    },
  });

  // prevent self-report
  const post = await prisma.circlePost.findUnique({
    where: { id: reportedPostId },
    select: { userId: true },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId === profile.id) {
    redirect("/circle?cannotReportSelf=1");
  }

  // prevent duplicate report (any status)
  const existingReport = await prisma.report.findFirst({
    where: {
      reporterId: profile.id,
      reportedPostId,
    },
  });

  if (existingReport) {
    redirect("/circle?alreadyReported=1");
  }

  // rate limit (max 5 per minute)
  const recentReports = await prisma.report.count({
    where: {
      reporterId: profile.id,
      createdAt: {
        gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS),
      },
    },
  });

  if (recentReports >= 5) {
    redirect("/circle?rateLimited=1");
  }

  await prisma.report.create({
    data: {
      reporterId: profile.id,
      reportedPostId,
      reportedUserId: reportedUserId || null,
      reason,
      status: "pending",
    },
  });

  revalidatePath("/moderation");
  revalidatePath(`/moderation/posts/${reportedPostId}`);

  redirect("/circle?reported=1");
}