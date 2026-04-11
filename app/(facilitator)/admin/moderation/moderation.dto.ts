export type ModerationQueueStatus =
  | "PENDING"
  | "REVIEWED"
  | "ACTION_TAKEN"
  | "DISMISSED";

export type ModerationSeverity = "LOW" | "MEDIUM" | "HIGH";

export type ModerationActorSummary = {
  id: string;
  label: string;
};

export type ModerationReviewerSummary = {
  id: string | null;
  label: string | null;
};

export type ModerationQueueItemDTO = {
  reportId: string;
  postId: string;
  status: ModerationQueueStatus;
  reason: string | null;
  reasonSummary: string;
  notes: string | null;
  createdAt: string;

  content: string;
  riskScore: number;
  severity: ModerationSeverity | null;
  categories: string[];

  actor: ModerationActorSummary;

  deletedAt: string | null;
  isDeleted: boolean;

  reviewedAt: string | null;
  reviewer: ModerationReviewerSummary | null;
};

export type ModerationQueueGroupDTO = {
  pending: ModerationQueueItemDTO[];
  reviewed: ModerationQueueItemDTO[];
  actionTaken: ModerationQueueItemDTO[];
  dismissed: ModerationQueueItemDTO[];
};

export type ModerationPostDetailDTO = {
  reportId: string;
  postId: string;
  status: ModerationQueueStatus;
  reason: string | null;
  reasonSummary: string;
  notes: string | null;
  createdAt: string;

  content: string;
  riskScore: number;
  severity: ModerationSeverity | null;
  categories: string[];

  actor: ModerationActorSummary;

  deletedAt: string | null;
  isDeleted: boolean;

  reviewedAt: string | null;
  reviewer: ModerationReviewerSummary | null;
};