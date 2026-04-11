export type ReportStatus = "pending" | "reviewed" | "action_taken" | "dismissed";

export type ModerationActorSummary = {
  id: string;
  label: string;
};

export type ModerationReportDTO = {
  id: string;
  reason: string;
  status: ReportStatus;
  reporter: ModerationActorSummary;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: ModerationActorSummary | null;
};

export type ModerationQueueItemDTO = {
  postId: string;
  circleId: string;
  contentPreview: string;
  author: ModerationActorSummary;
  createdAt: string;
  deletedAt: string | null;
  totalReports: number;
  pendingReports: number;
  reviewedReports: number;
  actionTakenReports: number;
  dismissedReports: number;
  latestReportAt: string | null;
  distinctReasons: string[];
};

export type ModerationPostDetailDTO = {
  postId: string;
  circleId: string;
  content: string;
  author: ModerationActorSummary;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  totalReports: number;
  pendingReports: number;
  reviewedReports: number;
  actionTakenReports: number;
  dismissedReports: number;
  distinctReasons: string[];
  reports: ModerationReportDTO[];
};