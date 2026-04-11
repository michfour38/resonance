-- CreateEnum
CREATE TYPE "Pathway" AS ENUM ('discover', 'relate', 'harmonize');

-- CreateEnum
CREATE TYPE "JourneyStatus" AS ENUM ('waiting', 'active', 'completed', 'withdrawn');

-- CreateEnum
CREATE TYPE "CohortStatus" AS ENUM ('draft', 'open_enrollment', 'waiting', 'active', 'completed');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('enrolled', 'active', 'completed', 'withdrawn');

-- CreateEnum
CREATE TYPE "CircleRole" AS ENUM ('member', 'facilitator');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('locked', 'active', 'completed');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('room_reflection', 'inquiry', 'check_in');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('active', 'completed', 'abandoned');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "EntryPhase" AS ENUM ('pre_journey', 'in_journey');

-- CreateEnum
CREATE TYPE "InsightStatus" AS ENUM ('locked', 'discoverable', 'unlocked');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'reviewed', 'action_taken', 'dismissed');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "pathway" "Pathway" NOT NULL,
    "worldview_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "value_themes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "journey_status" "JourneyStatus" NOT NULL DEFAULT 'waiting',
    "onboarding_done" BOOLEAN NOT NULL DEFAULT false,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "invited_by" TEXT,
    "timezone" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohorts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "pathway" "Pathway",
    "start_at" TIMESTAMPTZ NOT NULL,
    "status" "CohortStatus" NOT NULL DEFAULT 'draft',
    "max_members" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cohorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohort_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cohort_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'enrolled',
    "enrolled_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" TIMESTAMPTZ,
    "withdrawn_at" TIMESTAMPTZ,

    CONSTRAINT "cohort_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cohort_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "facilitator_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "circles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circle_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "circle_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "CircleRole" NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "circle_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "is_integration" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_progress" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "cohort_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'locked',
    "scheduled_unlock_at" TIMESTAMPTZ NOT NULL,
    "unlocked_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "admin_override" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "journey_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflection_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "room_id" UUID NOT NULL,
    "session_type" "SessionType" NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'active',
    "summary" TEXT,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ,

    CONSTRAINT "reflection_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflection_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reflection_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reflection_session_id" UUID NOT NULL,
    "current_layer" INTEGER NOT NULL DEFAULT 1,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "abandoned" BOOLEAN NOT NULL DEFAULT false,
    "layer_responses" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inquiry_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "room_id" UUID,
    "entry_phase" "EntryPhase" NOT NULL DEFAULT 'in_journey',
    "content" TEXT NOT NULL,
    "word_count" INTEGER NOT NULL DEFAULT 0,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circle_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "circle_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "room_id" UUID,
    "prompt_id" UUID,
    "parent_id" UUID,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "circle_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circle_prompts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "circle_id" UUID NOT NULL,
    "room_id" UUID,
    "author_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_intro" BOOLEAN NOT NULL DEFAULT false,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "circle_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_definitions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unlock_criteria" JSONB NOT NULL,

    CONSTRAINT "insight_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_insights" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "insight_id" UUID NOT NULL,
    "status" "InsightStatus" NOT NULL DEFAULT 'locked',
    "content" JSONB,
    "unlocked_at" TIMESTAMPTZ,

    CONSTRAINT "user_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reporter_id" TEXT NOT NULL,
    "reported_user_id" TEXT,
    "reported_post_id" UUID,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMPTZ,
    "reviewed_by" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cohort_members_user_id_idx" ON "cohort_members"("user_id");

-- CreateIndex
CREATE INDEX "cohort_members_cohort_id_idx" ON "cohort_members"("cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "cohort_members_cohort_id_user_id_key" ON "cohort_members"("cohort_id", "user_id");

-- CreateIndex
CREATE INDEX "circles_cohort_id_idx" ON "circles"("cohort_id");

-- CreateIndex
CREATE INDEX "circle_members_circle_id_idx" ON "circle_members"("circle_id");

-- CreateIndex
CREATE INDEX "circle_members_user_id_idx" ON "circle_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "circle_members_circle_id_user_id_key" ON "circle_members"("circle_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_slug_key" ON "rooms"("slug");

-- CreateIndex
CREATE INDEX "journey_progress_user_id_idx" ON "journey_progress"("user_id");

-- CreateIndex
CREATE INDEX "journey_progress_cohort_id_idx" ON "journey_progress"("cohort_id");

-- CreateIndex
CREATE INDEX "journey_progress_scheduled_unlock_at_idx" ON "journey_progress"("scheduled_unlock_at");

-- CreateIndex
CREATE UNIQUE INDEX "journey_progress_user_id_cohort_id_room_id_key" ON "journey_progress"("user_id", "cohort_id", "room_id");

-- CreateIndex
CREATE INDEX "reflection_sessions_user_id_room_id_idx" ON "reflection_sessions"("user_id", "room_id");

-- CreateIndex
CREATE INDEX "reflection_messages_session_id_created_at_idx" ON "reflection_messages"("session_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_sessions_reflection_session_id_key" ON "inquiry_sessions"("reflection_session_id");

-- CreateIndex
CREATE INDEX "journal_entries_user_id_entry_phase_idx" ON "journal_entries"("user_id", "entry_phase");

-- CreateIndex
CREATE INDEX "circle_posts_circle_id_created_at_idx" ON "circle_posts"("circle_id", "created_at");

-- CreateIndex
CREATE INDEX "circle_prompts_circle_id_idx" ON "circle_prompts"("circle_id");

-- CreateIndex
CREATE UNIQUE INDEX "insight_definitions_slug_key" ON "insight_definitions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_insights_user_id_insight_id_key" ON "user_insights"("user_id", "insight_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_reported_post_id_idx" ON "reports"("reported_post_id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_members" ADD CONSTRAINT "cohort_members_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_members" ADD CONSTRAINT "cohort_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circles" ADD CONSTRAINT "circles_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circles" ADD CONSTRAINT "circles_facilitator_id_fkey" FOREIGN KEY ("facilitator_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_circle_id_fkey" FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_progress" ADD CONSTRAINT "journey_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_progress" ADD CONSTRAINT "journey_progress_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_progress" ADD CONSTRAINT "journey_progress_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflection_sessions" ADD CONSTRAINT "reflection_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflection_sessions" ADD CONSTRAINT "reflection_sessions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflection_messages" ADD CONSTRAINT "reflection_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "reflection_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_sessions" ADD CONSTRAINT "inquiry_sessions_reflection_session_id_fkey" FOREIGN KEY ("reflection_session_id") REFERENCES "reflection_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_posts" ADD CONSTRAINT "circle_posts_circle_id_fkey" FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_posts" ADD CONSTRAINT "circle_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_posts" ADD CONSTRAINT "circle_posts_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_posts" ADD CONSTRAINT "circle_posts_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "circle_prompts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_posts" ADD CONSTRAINT "circle_posts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "circle_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_prompts" ADD CONSTRAINT "circle_prompts_circle_id_fkey" FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_prompts" ADD CONSTRAINT "circle_prompts_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_prompts" ADD CONSTRAINT "circle_prompts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_insights" ADD CONSTRAINT "user_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_insights" ADD CONSTRAINT "user_insights_insight_id_fkey" FOREIGN KEY ("insight_id") REFERENCES "insight_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_user_id_fkey" FOREIGN KEY ("reported_user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_post_id_fkey" FOREIGN KEY ("reported_post_id") REFERENCES "circle_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
