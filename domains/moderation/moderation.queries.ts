import { prisma } from "@/lib/prisma";
import {
  ModerationQueueItemDTO,
  ModerationPostDetailDTO,
  ModerationActorSummary,
} from "./moderation.dto";

type ProfileRow = {
  id: string;
  display_name: string | null;
};

type ReportRow = {
  id: string;
  reason: string;
  status: string;
  created_at: Date;
  reviewed_at: Date | null;
  reporter_id: string;
  reviewed_by: string | null;
};

function actorLabel(profile: ProfileRow | null): string {
  if (profile?.display_name && profile.display_name.trim().length > 0) {
    return profile.display_name;
  }
  return `User ${(profile?.id ?? "unknown").slice(-6)}`;
}

function actorSummary(profile: ProfileRow | null, fallbackId?: string): ModerationActorSummary {
  const id = profile?.id ?? fallbackId ?? "unknown";
  return {
    id,
    label: profile ? actorLabel(profile) : `User ${id.slice(-6)}`,
  };
}

async function getProfilesMap(profileIds: string[]) {
  const uniqueIds = Array.from(new Set(profileIds.filter(Boolean)));
  if (uniqueIds.length === 0) return new Map<string, ProfileRow>();

  const profiles = await prisma.profiles.findMany({
    where: { id: { in: uniqueIds } },
    select: {
      id: true,
      display_name: true,
    },
  });

  return new Map(profiles.map((p) => [p.id, p]));
}

export async function getModerationQueue(): Promise<ModerationQueueItemDTO[]> {
  const posts = await prisma.circle_posts.findMany({
    where: {
      deleted_at: null,
      reports: {
        some: {
          status: "pending",
        },
      },
    },
    include: {
      profiles: {
        select: {
          id: true,
          display_name: true,
        },
      },
      reports: {
        select: {
          id: true,
          reason: true,
          status: true,
          created_at: true,
          reviewed_at: true,
          reporter_id: true,
          reviewed_by: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const mapped = posts.map((post) => {
    const totalReports = post.reports.length;
    const pendingReports = post.reports.filter((r) => r.status === "pending").length;
    const reviewedReports = post.reports.filter((r) => r.status === "reviewed").length;
    const actionTakenReports = post.reports.filter((r) => r.status === "action_taken").length;
    const dismissedReports = post.reports.filter((r) => r.status === "dismissed").length;

    const latestReport = [...post.reports].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const distinctReasons = Array.from(new Set(post.reports.map((r) => r.reason)));

    return {
      postId: post.id,
      circleId: post.circle_id,
      contentPreview: post.content.slice(0, 160),
      author: actorSummary(post.profiles, post.user_id),
      createdAt: post.created_at.toISOString(),
      deletedAt: post.deleted_at ? post.deleted_at.toISOString() : null,
      totalReports,
      pendingReports,
      reviewedReports,
      actionTakenReports,
      dismissedReports,
      latestReportAt: latestReport ? latestReport.created_at.toISOString() : null,
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
  const post = await prisma.circle_posts.findUnique({
    where: { id: postId },
    include: {
      profiles: {
        select: {
          id: true,
          display_name: true,
        },
      },
      reports: {
        select: {
          id: true,
          reason: true,
          status: true,
          created_at: true,
          reviewed_at: true,
          reporter_id: true,
          reviewed_by: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  const profileIds = [
    post.user_id,
    ...post.reports.map((r) => r.reporter_id),
    ...post.reports.map((r) => r.reviewed_by).filter((v): v is string => Boolean(v)),
  ];

  const profilesMap = await getProfilesMap(profileIds);

  const totalReports = post.reports.length;
  const pendingReports = post.reports.filter((r) => r.status === "pending").length;
  const reviewedReports = post.reports.filter((r) => r.status === "reviewed").length;
  const actionTakenReports = post.reports.filter((r) => r.status === "action_taken").length;
  const dismissedReports = post.reports.filter((r) => r.status === "dismissed").length;

  const distinctReasons = Array.from(new Set(post.reports.map((r) => r.reason)));

  return {
    postId: post.id,
    circleId: post.circle_id,
    content: post.content,
    author: actorSummary(post.profiles ?? profilesMap.get(post.user_id) ?? null, post.user_id),
    createdAt: post.created_at.toISOString(),
    updatedAt: post.updated_at.toISOString(),
    deletedAt: post.deleted_at ? post.deleted_at.toISOString() : null,
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
      reporter: actorSummary(
        profilesMap.get(report.reporter_id) ?? null,
        report.reporter_id
      ),
      createdAt: report.created_at.toISOString(),
      reviewedAt: report.reviewed_at ? report.reviewed_at.toISOString() : null,
      reviewedBy: report.reviewed_by
        ? actorSummary(
            profilesMap.get(report.reviewed_by) ?? null,
            report.reviewed_by
          )
        : null,
    })),
  };
}