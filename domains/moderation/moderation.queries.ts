import { prisma } from "@/lib/prisma";
import {
  ModerationQueueItemDTO,
  ModerationPostDetailDTO,
  ModerationActorSummary,
} from "./moderation.dto";

function actorLabel(profile: { displayName: string | null; id: string }): string {
  if (profile.displayName && profile.displayName.trim().length > 0) {
    return profile.displayName;
  }
  return `User ${profile.id.slice(-6)}`;
}

function actorSummary(profile: { id: string; displayName: string | null }): ModerationActorSummary {
  return {
    id: profile.id,
    label: actorLabel(profile),
  };
}

export async function getModerationQueue(): Promise<ModerationQueueItemDTO[]> {
  const posts = await prisma.circlePost.findMany({
    where: {
      deletedAt: null,
      reports: {
        some: {
          status: "pending",
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
        },
      },
      reports: {
        include: {
          reporter: {
            select: {
              id: true,
              displayName: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const mapped = posts.map((post) => {
    const totalReports = post.reports.length;
    const pendingReports = post.reports.filter((r) => r.status === "pending").length;
    const reviewedReports = post.reports.filter((r) => r.status === "reviewed").length;
    const actionTakenReports = post.reports.filter((r) => r.status === "action_taken").length;
    const dismissedReports = post.reports.filter((r) => r.status === "dismissed").length;

    const latestReport = post.reports.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    const distinctReasons = Array.from(new Set(post.reports.map((r) => r.reason)));

    return {
      postId: post.id,
      circleId: post.circleId,
      contentPreview: post.content.slice(0, 160),
      author: actorSummary(post.user),
      createdAt: post.createdAt.toISOString(),
      deletedAt: post.deletedAt ? post.deletedAt.toISOString() : null,
      totalReports,
      pendingReports,
      reviewedReports,
      actionTakenReports,
      dismissedReports,
      latestReportAt: latestReport ? latestReport.createdAt.toISOString() : null,
      distinctReasons,
    };
  });

  return mapped.sort((a, b) => {
    if (b.pendingReports !== a.pendingReports) {
      return b.pendingReports - a.pendingReports;
    }
    return b.totalReports - a.totalReports;
  });
}

export async function getModerationPostDetail(
  postId: string
): Promise<ModerationPostDetailDTO | null> {
  const post = await prisma.circlePost.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
        },
      },
      reports: {
        include: {
          reporter: {
            select: {
              id: true,
              displayName: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              displayName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  const totalReports = post.reports.length;
  const pendingReports = post.reports.filter((r) => r.status === "pending").length;
  const reviewedReports = post.reports.filter((r) => r.status === "reviewed").length;
  const actionTakenReports = post.reports.filter((r) => r.status === "action_taken").length;
  const dismissedReports = post.reports.filter((r) => r.status === "dismissed").length;

  const distinctReasons = Array.from(new Set(post.reports.map((r) => r.reason)));

  return {
    postId: post.id,
    circleId: post.circleId,
    content: post.content,
    author: actorSummary(post.user),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    deletedAt: post.deletedAt ? post.deletedAt.toISOString() : null,
    totalReports,
    pendingReports,
    reviewedReports,
    actionTakenReports,
    dismissedReports,
    distinctReasons,
    reports: post.reports.map((report) => ({
      id: report.id,
      reason: report.reason,
      status: report.status,
      reporter: actorSummary(report.reporter),
      createdAt: report.createdAt.toISOString(),
      reviewedAt: report.reviewedAt ? report.reviewedAt.toISOString() : null,
      reviewedBy: report.reviewer ? actorSummary(report.reviewer) : null,
    })),
  };
}