import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  ModerationActorSummary,
  ModerationPostDetailDTO,
  ModerationQueueGroupDTO,
  ModerationQueueItemDTO,
  ModerationQueueStatus,
  ModerationReviewerSummary,
  ModerationSeverity,
} from "./moderation.dto";

type ModerationQueueRow = {
  report_id: string;
  report_status: string | null;
  report_reason: string | null;
  report_notes: string | null;
  report_created_at: Date | string;
  report_reviewed_at: Date | string | null;
  report_reviewed_by: string | null;

  post_id: string;
  post_content: string | null;
  post_risk_score: number | null;
  post_severity: string | null;
  post_categories: unknown;
  post_deleted_at: Date | string | null;

  profile_id: string | null;
  profile_display_name: string | null;

  reviewer_profile_id: string | null;
  reviewer_display_name: string | null;
};

type InformationSchemaColumnRow = {
  column_name: string;
};

type EnumValueRow = {
  enum_value: string;
};

type CirclePostColumnMap = {
  actorColumn: string;
  contentColumn: string;
  riskScoreColumn: string | null;
  severityColumn: string | null;
  categoriesColumn: string | null;
};

function actorLabel(actor: { id: string; displayName: string | null }): string {
  if (actor.displayName && actor.displayName.trim().length > 0) {
    return actor.displayName.trim();
  }

  return `User ${actor.id.slice(-6)}`;
}

function actorSummary(actor: {
  id: string;
  displayName: string | null;
}): ModerationActorSummary {
  return {
    id: actor.id,
    label: actorLabel(actor),
  };
}

function reviewerLabel(reviewer: {
  id: string | null;
  displayName: string | null;
}): string | null {
  if (!reviewer.id) {
    return null;
  }

  if (reviewer.displayName && reviewer.displayName.trim().length > 0) {
    return reviewer.displayName.trim();
  }

  return `User ${reviewer.id.slice(-6)}`;
}

function reviewerSummary(reviewer: {
  id: string | null;
  displayName: string | null;
}): ModerationReviewerSummary | null {
  if (!reviewer.id) {
    return null;
  }

  return {
    id: reviewer.id,
    label: reviewerLabel(reviewer),
  };
}

function normalizeStatus(value: string | null): ModerationQueueStatus {
  const normalized = (value ?? "").toLowerCase();

  switch (normalized) {
    case "reviewed":
      return "REVIEWED";

    case "action_taken":
    case "removed":
    case "resolved":
    case "closed":
    case "deleted":
    case "taken_down":
    case "moderated":
      return "ACTION_TAKEN";

    case "dismissed":
      return "DISMISSED";

    case "pending":
    default:
      return "PENDING";
  }
}

function normalizeSeverity(value: string | null): ModerationSeverity | null {
  switch ((value ?? "").toUpperCase()) {
    case "LOW":
      return "LOW";
    case "MEDIUM":
      return "MEDIUM";
    case "HIGH":
      return "HIGH";
    default:
      return null;
  }
}

function normalizeCategories(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return [];
    }
  }

  return [];
}

function buildReasonSummary(reason: string | null): string {
  if (!reason || reason.trim().length === 0) {
    return "No reason provided";
  }

  if (reason.startsWith("SYSTEM_AUTO_FLAG:")) {
    return "Automatically flagged by the system";
  }

  return reason;
}

function mapRowToQueueItem(row: ModerationQueueRow): ModerationQueueItemDTO {
  const profileId = row.profile_id ?? "unknown-user";
  const deletedAt = row.post_deleted_at
    ? new Date(row.post_deleted_at).toISOString()
    : null;
  const reviewedAt = row.report_reviewed_at
    ? new Date(row.report_reviewed_at).toISOString()
    : null;

  return {
    reportId: row.report_id,
    postId: row.post_id,
    status: normalizeStatus(row.report_status),
    reason: row.report_reason,
    reasonSummary: buildReasonSummary(row.report_reason),
    notes: row.report_notes,
    createdAt: new Date(row.report_created_at).toISOString(),

    content: row.post_content ?? "",
    riskScore: Number(row.post_risk_score ?? 0),
    severity: normalizeSeverity(row.post_severity),
    categories: normalizeCategories(row.post_categories),

    actor: actorSummary({
      id: profileId,
      displayName: row.profile_display_name,
    }),

    deletedAt,
    isDeleted: deletedAt !== null,

    reviewedAt,
    reviewer: reviewerSummary({
      id: row.reviewer_profile_id ?? row.report_reviewed_by,
      displayName: row.reviewer_display_name,
    }),
  };
}

function mapRowToPostDetail(row: ModerationQueueRow): ModerationPostDetailDTO {
  return mapRowToQueueItem(row);
}

async function getTableColumns(tableName: string): Promise<string[]> {
  const rows = await prisma.$queryRaw<InformationSchemaColumnRow[]>(Prisma.sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = ${tableName}
    ORDER BY ordinal_position
  `);

  return rows.map((row) => row.column_name);
}

async function getReportStatusEnumValues(): Promise<string[]> {
  const rows = await prisma.$queryRaw<EnumValueRow[]>(Prisma.sql`
    SELECT e.enumlabel AS enum_value
    FROM pg_type t
    INNER JOIN pg_enum e
      ON t.oid = e.enumtypid
    WHERE t.typname = 'ReportStatus'
    ORDER BY e.enumsortorder
  `);

  return rows.map((row) => row.enum_value);
}

function pickFirstExisting(
  columns: string[],
  candidates: string[]
): string | null {
  for (const candidate of candidates) {
    if (columns.includes(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getCirclePostColumnMap(circlePostColumns: string[]): CirclePostColumnMap {
  const actorColumn = pickFirstExisting(circlePostColumns, [
    "profile_id",
    "user_id",
    "author_id",
    "created_by",
    "created_by_id",
    "owner_id",
    "member_id",
  ]);

  if (!actorColumn) {
    throw new Error(
      `Could not find the actor column on circle_posts. Columns found: ${circlePostColumns.join(", ")}`
    );
  }

  const contentColumn = pickFirstExisting(circlePostColumns, [
    "content",
    "body",
    "text",
    "message",
    "post_content",
  ]);

  if (!contentColumn) {
    throw new Error(
      `Could not find the content column on circle_posts. Columns found: ${circlePostColumns.join(", ")}`
    );
  }

  const riskScoreColumn = pickFirstExisting(circlePostColumns, [
    "risk_score",
    "riskscore",
    "score",
    "moderation_score",
    "auto_moderation_score",
  ]);

  const severityColumn = pickFirstExisting(circlePostColumns, [
    "severity",
    "risk_severity",
    "moderation_severity",
  ]);

  const categoriesColumn = pickFirstExisting(circlePostColumns, [
    "categories",
    "flags",
    "moderation_categories",
    "detected_categories",
  ]);

  return {
    actorColumn,
    contentColumn,
    riskScoreColumn,
    severityColumn,
    categoriesColumn,
  };
}

function buildSelectFragment(columnName: string | null, alias: string): Prisma.Sql {
  if (!columnName) {
    return Prisma.sql`NULL AS ${Prisma.raw(alias)}`;
  }

  return Prisma.sql`cp.${Prisma.raw(`"${columnName}"`)} AS ${Prisma.raw(alias)}`;
}

async function runQueueQuery(
  columnMap: CirclePostColumnMap,
  reportId?: string
): Promise<ModerationQueueRow[]> {
  const actorJoinColumn = Prisma.raw(`"${columnMap.actorColumn}"`);
  const contentColumn = Prisma.raw(`"${columnMap.contentColumn}"`);

  const riskScoreSelect = buildSelectFragment(
    columnMap.riskScoreColumn,
    "post_risk_score"
  );

  const severitySelect = buildSelectFragment(
    columnMap.severityColumn,
    "post_severity"
  );

  const categoriesSelect = buildSelectFragment(
    columnMap.categoriesColumn,
    "post_categories"
  );

  if (reportId) {
    return prisma.$queryRaw<ModerationQueueRow[]>(Prisma.sql`
      SELECT
        r.id AS report_id,
        r.status AS report_status,
        r.reason AS report_reason,
        r.admin_notes AS report_notes,
        r.created_at AS report_created_at,
        r.reviewed_at AS report_reviewed_at,
        r.reviewed_by AS report_reviewed_by,

        cp.id AS post_id,
        cp.${contentColumn} AS post_content,
        ${riskScoreSelect},
        ${severitySelect},
        ${categoriesSelect},
        cp.deleted_at AS post_deleted_at,

        p.id AS profile_id,
        p.display_name AS profile_display_name,

        reviewer.id AS reviewer_profile_id,
        reviewer.display_name AS reviewer_display_name
      FROM reports r
      INNER JOIN circle_posts cp
        ON cp.id = CAST(r.reported_post_id AS uuid)
      LEFT JOIN profiles p
        ON p.id::text = cp.${actorJoinColumn}::text
      LEFT JOIN profiles reviewer
        ON reviewer.id = r.reviewed_by
      WHERE r.id = CAST(${reportId} AS uuid)
      ORDER BY COALESCE(r.reviewed_at, r.created_at) DESC, r.created_at DESC
    `);
  }

  return prisma.$queryRaw<ModerationQueueRow[]>(Prisma.sql`
    SELECT
      r.id AS report_id,
      r.status AS report_status,
      r.reason AS report_reason,
      r.admin_notes AS report_notes,
      r.created_at AS report_created_at,
      r.reviewed_at AS report_reviewed_at,
      r.reviewed_by AS report_reviewed_by,

      cp.id AS post_id,
      cp.${contentColumn} AS post_content,
      ${riskScoreSelect},
      ${severitySelect},
      ${categoriesSelect},
      cp.deleted_at AS post_deleted_at,

      p.id AS profile_id,
      p.display_name AS profile_display_name,

      reviewer.id AS reviewer_profile_id,
      reviewer.display_name AS reviewer_display_name
    FROM reports r
    INNER JOIN circle_posts cp
      ON cp.id = CAST(r.reported_post_id AS uuid)
    LEFT JOIN profiles p
      ON p.id::text = cp.${actorJoinColumn}::text
    LEFT JOIN profiles reviewer
      ON reviewer.id = r.reviewed_by
    ORDER BY COALESCE(r.reviewed_at, r.created_at) DESC, r.created_at DESC
  `);
}

function resolveDatabaseStatus(
  desiredStatus: ModerationQueueStatus,
  enumValues: string[]
): string {
  const directMatches: Record<ModerationQueueStatus, string[]> = {
    PENDING: ["pending"],
    REVIEWED: ["reviewed"],
    ACTION_TAKEN: [
      "action_taken",
      "removed",
      "resolved",
      "closed",
      "deleted",
      "taken_down",
      "moderated",
      "reviewed",
    ],
    DISMISSED: ["dismissed"],
  };

  const allowed = directMatches[desiredStatus];

  for (const candidate of allowed) {
    if (enumValues.includes(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `Could not map moderation status "${desiredStatus}" to database enum "ReportStatus". Allowed enum values: ${enumValues.join(", ")}`
  );
}

async function getCirclePostColumnMapFromDatabase(): Promise<CirclePostColumnMap> {
  const circlePostColumns = await getTableColumns("circle_posts");
  return getCirclePostColumnMap(circlePostColumns);
}

export async function getModerationQueue(): Promise<EnrichedModerationQueueGroupDTO> {
  const columnMap = await getCirclePostColumnMapFromDatabase();
  const rows = await runQueueQuery(columnMap);
  const items = rows.map(mapRowToQueueItem);

  const allItems = items;
  const pendingItems = items.filter((item) => item.status === "PENDING");

  return {
    pending: sortByIntelligencePriority(enrichItems(pendingItems, allItems)),
    reviewed: items.filter((item) => item.status === "REVIEWED"),
    actionTaken: items.filter((item) => item.status === "ACTION_TAKEN"),
    dismissed: items.filter((item) => item.status === "DISMISSED"),
  };
}

export async function getModerationReportDetail(
  reportId: string
): Promise<EnrichedModerationQueueItemDTO | null> {
  const columnMap = await getCirclePostColumnMapFromDatabase();
  const reportRows = await runQueueQuery(columnMap, reportId);

  if (reportRows.length === 0) {
    return null;
  }

  const item = mapRowToQueueItem(reportRows[0]);

  if (item.status !== "PENDING") {
    return {
      ...item,
      intelligence: null as unknown as ModerationIntelligence,
    };
  }

  const allRows = await runQueueQuery(columnMap);
  const allItems = allRows.map(mapRowToQueueItem);

  return {
    ...item,
    intelligence: computeIntelligence(item, allItems),
  };
}

export async function updateReportStatus(
  reportId: string,
  status: ModerationQueueStatus,
  reviewedByUserId: string
): Promise<void> {
  const enumValues = await getReportStatusEnumValues();
  const databaseStatus = resolveDatabaseStatus(status, enumValues);

  await prisma.$executeRaw`
    UPDATE reports
    SET
      status = CAST(${databaseStatus} AS "ReportStatus"),
      reviewed_at = NOW(),
      reviewed_by = ${reviewedByUserId}
    WHERE id = CAST(${reportId} AS uuid)
  `;
}

export async function updateReportNotes(
  reportId: string,
  notes: string
): Promise<void> {
  await prisma.$executeRaw`
    UPDATE reports
    SET admin_notes = ${notes}
    WHERE id = CAST(${reportId} AS uuid)
  `;
}

export async function removePostAndMarkActionTaken(
  reportId: string,
  postId: string,
  reviewedByUserId: string
): Promise<void> {
  const enumValues = await getReportStatusEnumValues();
  const databaseStatus = resolveDatabaseStatus("ACTION_TAKEN", enumValues);

  await prisma.$transaction([
    prisma.$executeRaw`
      UPDATE circle_posts
      SET deleted_at = NOW()
      WHERE id = CAST(${postId} AS uuid)
    `,
    prisma.$executeRaw`
      UPDATE reports
      SET
        status = CAST(${databaseStatus} AS "ReportStatus"),
        reviewed_at = NOW(),
        reviewed_by = ${reviewedByUserId}
      WHERE id = CAST(${reportId} AS uuid)
    `,
  ]);
}

// ─── Moderation Intelligence Layer ───────────────────────────────────────────

export type RiskTier = "HIGH" | "MEDIUM" | "LOW";
export type SuggestedAction = "REMOVE" | "REVIEW";
export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ModerationIntelligence {
  riskScore: number;
  riskTier: RiskTier;
  suggestedAction: SuggestedAction;
  confidence: ConfidenceLevel;
  reasoning: string;
  confirmedRemovalCount: number;
  pendingReportCount: number;
  patternNote: string | null;
}

export type EnrichedModerationQueueItemDTO = ModerationQueueItemDTO & {
  intelligence: ModerationIntelligence;
};

export type EnrichedModerationQueueGroupDTO = Omit<
  ModerationQueueGroupDTO,
  "pending"
> & {
  pending: EnrichedModerationQueueItemDTO[];
};

function deriveContentSignal(params: {
  reason: string | null;
  categories: string[];
}): number {
  const reason = (params.reason ?? "").toLowerCase();
  const categories = params.categories.map((c) => c.toLowerCase());

  let score = 0;
  const text = `${reason} ${categories.join(" ")}`;

  if (
    text.includes("harass") ||
    text.includes("abuse") ||
    text.includes("hate") ||
    text.includes("threat") ||
    text.includes("violent")
  ) {
    score += 12;
  }

  if (
    text.includes("spam") ||
    text.includes("scam") ||
    text.includes("promo") ||
    text.includes("advert") ||
    text.includes("fake") ||
    text.includes("phish")
  ) {
    score += 10;
  }

  if (
    text.includes("sexual") ||
    text.includes("explicit") ||
    text.includes("nudity") ||
    text.includes("minor") ||
    text.includes("child")
  ) {
    score += 15;
  }

  if (reason.startsWith("system_auto_flag:")) {
    score += 6;
  }

  if (categories.length >= 2) {
    score += 4;
  }

  return Math.min(score, 20);
}

function deriveRiskScore(params: {
  severity: ModerationSeverity | null;
  baseRiskScore: number;
  contentSignal: number;
  reportCount: number;
  ageHours: number;
  confirmedRemovalCount: number;
  pendingReportCount: number;
}): number {
  const {
    severity,
    baseRiskScore,
    contentSignal,
    reportCount,
    ageHours,
    confirmedRemovalCount,
    pendingReportCount,
  } = params;

  const severityScore =
    severity === "HIGH" ? 30 : severity === "MEDIUM" ? 16 : 4;

  const modelScore = Math.max(0, Math.min(baseRiskScore, 100));
  const baseRiskContribution = Math.round(modelScore * 0.25);

  const volumeScore =
    reportCount > 1
      ? Math.min(Math.round(Math.log2(reportCount) * 5), 12)
      : 0;

  const recencyScore =
    ageHours < 1 ? 16 : ageHours < 6 ? 9 : ageHours < 24 ? 4 : 0;

  const historyScore = Math.min(confirmedRemovalCount * 6, 18);

  const openReportsScore =
    pendingReportCount >= 4
      ? 10
      : pendingReportCount === 3
        ? 7
        : pendingReportCount === 2
          ? 4
          : 0;

  return Math.min(
    severityScore +
      baseRiskContribution +
      contentSignal +
      volumeScore +
      recencyScore +
      historyScore +
      openReportsScore,
    100
  );
}

function deriveSuggestion(params: {
  riskScore: number;
  confirmedRemovalCount: number;
  pendingReportCount: number;
  severity: ModerationSeverity | null;
}): Pick<ModerationIntelligence, "suggestedAction" | "confidence" | "reasoning"> {
  const { riskScore, confirmedRemovalCount, pendingReportCount, severity } =
    params;

  if (confirmedRemovalCount >= 2) {
    return {
      suggestedAction: "REMOVE",
      confidence: "HIGH",
      reasoning:
        "Repeated confirmed moderation history. Review for likely removal.",
    };
  }

  if (severity === "HIGH" && confirmedRemovalCount >= 1) {
    return {
      suggestedAction: "REMOVE",
      confidence: "MEDIUM",
      reasoning:
        "High-severity report with prior confirmed moderation history.",
    };
  }

  if (riskScore >= 65) {
    return {
      suggestedAction: "REVIEW",
      confidence: "HIGH",
      reasoning: "Several meaningful risk signals are present.",
    };
  }

  if (riskScore >= 35) {
    return {
      suggestedAction: "REVIEW",
      confidence: "MEDIUM",
      reasoning: "Some meaningful risk signals are present.",
    };
  }

  if (pendingReportCount >= 3 || confirmedRemovalCount >= 1) {
    return {
      suggestedAction: "REVIEW",
      confidence: "MEDIUM",
      reasoning: "Pattern history suggests this deserves closer review.",
    };
  }

  return {
    suggestedAction: "REVIEW",
    confidence: "LOW",
    reasoning: "Limited signal. A quick human review is recommended.",
  };
}

function buildPatternNote(
  confirmedRemovalCount: number,
  pendingReportCount: number
): string | null {
  if (confirmedRemovalCount >= 1 && pendingReportCount > 1) {
    return `Pattern detected: ${confirmedRemovalCount} prior confirmed removal${
      confirmedRemovalCount > 1 ? "s" : ""
    } and ${pendingReportCount} open reports.`;
  }
  if (confirmedRemovalCount >= 1) {
    return `Pattern detected: ${confirmedRemovalCount} prior confirmed removal${
      confirmedRemovalCount > 1 ? "s" : ""
    }.`;
  }
  if (pendingReportCount >= 3) {
    return `Pattern detected: ${pendingReportCount} open reports for this user.`;
  }
  return null;
}

function computeIntelligence(
  item: ModerationQueueItemDTO,
  allItems: ModerationQueueItemDTO[]
): ModerationIntelligence {
  const actorId = item.actor.id;

  const actorItems = allItems.filter((i) => i.actor.id === actorId);

  const confirmedRemovalCount = actorItems.filter(
    (i) => i.status === "ACTION_TAKEN"
  ).length;

  const pendingReportCount = actorItems.filter(
    (i) => i.status === "PENDING"
  ).length;

  const reportCount = allItems.filter((i) => i.postId === item.postId).length;

  const ageHours =
    (Date.now() - new Date(item.createdAt).getTime()) / 3_600_000;

  const contentSignal = deriveContentSignal({
    reason: item.reason,
    categories: item.categories,
  });

  const riskScore = deriveRiskScore({
    severity: item.severity,
    baseRiskScore: item.riskScore,
    contentSignal,
    reportCount,
    ageHours,
    confirmedRemovalCount,
    pendingReportCount,
  });

  const riskTier: RiskTier =
    riskScore >= 65 ? "HIGH" : riskScore >= 35 ? "MEDIUM" : "LOW";

  const { suggestedAction, confidence, reasoning } = deriveSuggestion({
    riskScore,
    confirmedRemovalCount,
    pendingReportCount,
    severity: item.severity,
  });

  const patternNote = buildPatternNote(
    confirmedRemovalCount,
    pendingReportCount
  );

  return {
    riskScore,
    riskTier,
    suggestedAction,
    confidence,
    reasoning,
    confirmedRemovalCount,
    pendingReportCount,
    patternNote,
  };
}

function sortByIntelligencePriority(
  items: EnrichedModerationQueueItemDTO[]
): EnrichedModerationQueueItemDTO[] {
  return [...items].sort((a, b) => {
    const scoreDiff = b.intelligence.riskScore - a.intelligence.riskScore;
    if (scoreDiff !== 0) return scoreDiff;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function enrichItems(
  items: ModerationQueueItemDTO[],
  allItems: ModerationQueueItemDTO[]
): EnrichedModerationQueueItemDTO[] {
  return items.map((item) => ({
    ...item,
    intelligence: computeIntelligence(item, allItems),
  }));
}

// ─── Moderation Audit Layer ───────────────────────────────────────────────────
//
// Read-only. No new tables. Reuses the same reports/circle_posts/profiles join
// pattern already in this file, filtered to reviewed_at IS NOT NULL only.
// Sorted strictly by reviewed_at DESC.
//
// auditParseDecisionNote and auditDecisionLabel are private duplicates of the
// helpers in actions.ts, kept here to avoid a circular import.

type AuditDecisionReason =
  | "NO_VIOLATION"
  | "CONTEXT_MISSING"
  | "INCONCLUSIVE"
  | "NEEDS_MORE_CONTEXT"
  | "SPAM"
  | "HARASSMENT"
  | "HATE"
  | "SAFETY"
  | "OTHER";

const AUDIT_ALL_REASONS: readonly string[] = [
  "NO_VIOLATION",
  "CONTEXT_MISSING",
  "INCONCLUSIVE",
  "NEEDS_MORE_CONTEXT",
  "SPAM",
  "HARASSMENT",
  "HATE",
  "SAFETY",
  "OTHER",
];

function auditParseDecisionNote(notes: string | null): {
  reason: AuditDecisionReason | null;
  freeText: string | null;
} {
  if (!notes) return { reason: null, freeText: null };

  const match = notes.match(/^\[DECISION_REASON:\s*([A-Z_]+)\](?:\s(.+))?$/s);
  if (!match) return { reason: null, freeText: null };

  const candidate = match[1];
  if (!AUDIT_ALL_REASONS.includes(candidate)) {
    return { reason: null, freeText: null };
  }

  return {
    reason: candidate as AuditDecisionReason,
    freeText: match[2]?.trim() || null,
  };
}

function auditDecisionLabel(reason: AuditDecisionReason): string {
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

export interface ModerationAuditEntryDTO {
  reportId: string;
  postId: string;
  actor: {
    id: string;
    label: string;
  };
  moderator: {
    id: string;
    label: string;
  } | null;
  status: ModerationQueueStatus;
  decisionReason: AuditDecisionReason | null;
  decisionReasonLabel: string | null;
  decisionNote: string | null;
  rawNotes: string | null;
  reviewedAt: string;
  postSnippet: string;
  postDeleted: boolean;
}

function mapRowToAuditEntry(row: ModerationQueueRow): ModerationAuditEntryDTO {
  const actorId = row.profile_id ?? "unknown-user";
  const actorLabelStr =
    row.profile_display_name?.trim() || `User ${actorId.slice(-6)}`;

  const moderatorId = row.reviewer_profile_id ?? row.report_reviewed_by;
  const moderatorLabelStr = moderatorId
    ? row.reviewer_display_name?.trim() || `User ${moderatorId.slice(-6)}`
    : null;

  const { reason, freeText } = auditParseDecisionNote(row.report_notes);
  const rawNotes = reason === null ? row.report_notes : null;

  const rawContent = row.post_content ?? "";
  const postSnippet =
    rawContent.length > 120
      ? rawContent.slice(0, 120).trimEnd() + "…"
      : rawContent;

  return {
    reportId: row.report_id,
    postId: row.post_id,
    actor: { id: actorId, label: actorLabelStr },
    moderator: moderatorId
      ? { id: moderatorId, label: moderatorLabelStr! }
      : null,
    status: normalizeStatus(row.report_status),
    decisionReason: reason,
    decisionReasonLabel: reason ? auditDecisionLabel(reason) : null,
    decisionNote: freeText,
    rawNotes,
    reviewedAt: new Date(row.report_reviewed_at!).toISOString(),
    postSnippet,
    postDeleted: row.post_deleted_at !== null,
  };
}

async function runAuditQuery(
  columnMap: CirclePostColumnMap
): Promise<ModerationQueueRow[]> {
  const actorJoinColumn = Prisma.raw(`"${columnMap.actorColumn}"`);
  const contentColumn = Prisma.raw(`"${columnMap.contentColumn}"`);

  const riskScoreSelect = buildSelectFragment(
    columnMap.riskScoreColumn,
    "post_risk_score"
  );
  const severitySelect = buildSelectFragment(
    columnMap.severityColumn,
    "post_severity"
  );
  const categoriesSelect = buildSelectFragment(
    columnMap.categoriesColumn,
    "post_categories"
  );

  return prisma.$queryRaw<ModerationQueueRow[]>(Prisma.sql`
    SELECT
      r.id AS report_id,
      r.status AS report_status,
      r.reason AS report_reason,
      r.admin_notes AS report_notes,
      r.created_at AS report_created_at,
      r.reviewed_at AS report_reviewed_at,
      r.reviewed_by AS report_reviewed_by,

      cp.id AS post_id,
      cp.${contentColumn} AS post_content,
      ${riskScoreSelect},
      ${severitySelect},
      ${categoriesSelect},
      cp.deleted_at AS post_deleted_at,

      p.id AS profile_id,
      p.display_name AS profile_display_name,

      reviewer.id AS reviewer_profile_id,
      reviewer.display_name AS reviewer_display_name

    FROM reports r
    INNER JOIN circle_posts cp
      ON cp.id = CAST(r.reported_post_id AS uuid)
    LEFT JOIN profiles p
      ON p.id::text = cp.${actorJoinColumn}::text
    LEFT JOIN profiles reviewer
      ON reviewer.id = r.reviewed_by

    WHERE r.reviewed_at IS NOT NULL
    ORDER BY r.reviewed_at DESC
  `);
}

export async function getModerationAuditLog(): Promise<ModerationAuditEntryDTO[]> {
  const columnMap = await getCirclePostColumnMapFromDatabase();
  const rows = await runAuditQuery(columnMap);
  return rows.map(mapRowToAuditEntry);
}