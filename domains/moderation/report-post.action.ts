"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export async function reportPostAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const reportedPostId = String(formData.get("reportedPostId") ?? "");
  const reportedUserId = String(formData.get("reportedUserId") ?? "");
  const reason = String(formData.get("reason") ?? "");

  if (!reportedPostId || !reason) {
    throw new Error("Missing required report fields");
  }

  const profile = await prisma.profiles.upsert({
    where: { id: userId },
    update: {},
create: {
  id: userId,
  display_name: "New User",
  pathway: "discover",
  journey_status: "active",
  onboarding_done: true,
  updated_at: new Date(),
},
  });

  const post = await prisma.circle_posts.findUnique({
    where: { id: reportedPostId },
    select: { user_id: true },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.user_id === profile.id) {
    redirect("/circle?cannotReportSelf=1");
  }

  const existingReport = await prisma.reports.findFirst({
    where: {
      reporter_id: profile.id,
      reported_post_id: reportedPostId,
    },
  });

  if (existingReport) {
    redirect("/circle?alreadyReported=1");
  }

  const recentReports = await prisma.reports.count({
    where: {
      reporter_id: profile.id,
      created_at: {
        gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS),
      },
    },
  });

  if (recentReports >= 5) {
    redirect("/circle?rateLimited=1");
  }

  await prisma.reports.create({
    data: {
      reporter_id: profile.id,
      reported_post_id: reportedPostId,
      reported_user_id: reportedUserId || null,
      reason,
      status: "pending",
    },
  });

  revalidatePath("/moderation");
  revalidatePath(`/moderation/posts/${reportedPostId}`);

  redirect("/circle?reported=1");
}