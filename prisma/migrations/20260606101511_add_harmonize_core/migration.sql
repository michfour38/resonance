-- CreateEnum
CREATE TYPE "HarmonizeMode" AS ENUM ('couple', 'family_adults', 'team', 'parallel_parenting_adults');

-- CreateEnum
CREATE TYPE "HarmonizeSystemStatus" AS ENUM ('active', 'paused', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "HarmonizeRole" AS ENUM ('partner', 'parent', 'sibling', 'colleague', 'child');

-- CreateEnum
CREATE TYPE "HarmonizeCycleStatus" AS ENUM ('active', 'paused', 'review_due', 'reviewed', 'incomplete');

-- CreateEnum
CREATE TYPE "HarmonizeScope" AS ENUM ('private', 'shared', 'pause', 'system');

-- CreateEnum
CREATE TYPE "HarmonizeOutcome" AS ENUM ('integration', 'repetition', 'mimicry', 'incomplete');

-- CreateTable
CREATE TABLE "harmonize_systems" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mode" "HarmonizeMode" NOT NULL,
    "name" TEXT,
    "status" "HarmonizeSystemStatus" NOT NULL DEFAULT 'active',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "harmonize_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "harmonize_participants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "system_id" UUID NOT NULL,
    "profile_id" TEXT NOT NULL,
    "role" "HarmonizeRole" NOT NULL,
    "is_minor" BOOLEAN NOT NULL DEFAULT false,
    "birthdate" DATE,
    "minor_access_enabled" BOOLEAN NOT NULL DEFAULT false,
    "guardian_verified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "harmonize_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "harmonize_cycles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "system_id" UUID NOT NULL,
    "title" TEXT,
    "status" "HarmonizeCycleStatus" NOT NULL DEFAULT 'active',
    "signal_snapshot" JSONB NOT NULL DEFAULT '{}',
    "pattern_snapshot" JSONB NOT NULL DEFAULT '{}',
    "system_snapshot" JSONB NOT NULL DEFAULT '{}',
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "harmonize_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "harmonize_entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cycle_id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "scope" "HarmonizeScope" NOT NULL,
    "content" TEXT NOT NULL,
    "share_risk_level" INTEGER NOT NULL DEFAULT 0,
    "requires_review_before_send" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "harmonize_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "harmonize_share_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entry_id" UUID NOT NULL,
    "risk_level" INTEGER NOT NULL DEFAULT 0,
    "risk_type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "reviewed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "harmonize_share_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "harmonize_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cycle_id" UUID NOT NULL,
    "outcome" "HarmonizeOutcome" NOT NULL,
    "summary" TEXT,
    "same_within_self" TEXT,
    "different_within_self" TEXT,
    "different_in_system" TEXT,
    "newly_visible" TEXT,
    "five_percent_practice" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "harmonize_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "harmonize_systems_mode_idx" ON "harmonize_systems"("mode");

-- CreateIndex
CREATE INDEX "harmonize_systems_status_idx" ON "harmonize_systems"("status");

-- CreateIndex
CREATE INDEX "harmonize_systems_created_by_idx" ON "harmonize_systems"("created_by");

-- CreateIndex
CREATE INDEX "harmonize_participants_system_id_idx" ON "harmonize_participants"("system_id");

-- CreateIndex
CREATE INDEX "harmonize_participants_profile_id_idx" ON "harmonize_participants"("profile_id");

-- CreateIndex
CREATE INDEX "harmonize_participants_role_idx" ON "harmonize_participants"("role");

-- CreateIndex
CREATE UNIQUE INDEX "harmonize_participants_system_id_profile_id_key" ON "harmonize_participants"("system_id", "profile_id");

-- CreateIndex
CREATE INDEX "harmonize_cycles_system_id_idx" ON "harmonize_cycles"("system_id");

-- CreateIndex
CREATE INDEX "harmonize_cycles_status_idx" ON "harmonize_cycles"("status");

-- CreateIndex
CREATE INDEX "harmonize_entries_cycle_id_idx" ON "harmonize_entries"("cycle_id");

-- CreateIndex
CREATE INDEX "harmonize_entries_participant_id_idx" ON "harmonize_entries"("participant_id");

-- CreateIndex
CREATE INDEX "harmonize_entries_scope_idx" ON "harmonize_entries"("scope");

-- CreateIndex
CREATE INDEX "harmonize_share_reviews_entry_id_idx" ON "harmonize_share_reviews"("entry_id");

-- CreateIndex
CREATE INDEX "harmonize_share_reviews_risk_type_idx" ON "harmonize_share_reviews"("risk_type");

-- CreateIndex
CREATE INDEX "harmonize_reviews_cycle_id_idx" ON "harmonize_reviews"("cycle_id");

-- CreateIndex
CREATE INDEX "harmonize_reviews_outcome_idx" ON "harmonize_reviews"("outcome");

-- AddForeignKey
ALTER TABLE "harmonize_systems" ADD CONSTRAINT "harmonize_systems_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harmonize_participants" ADD CONSTRAINT "harmonize_participants_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "harmonize_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harmonize_participants" ADD CONSTRAINT "harmonize_participants_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harmonize_cycles" ADD CONSTRAINT "harmonize_cycles_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "harmonize_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harmonize_entries" ADD CONSTRAINT "harmonize_entries_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "harmonize_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harmonize_entries" ADD CONSTRAINT "harmonize_entries_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "harmonize_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harmonize_share_reviews" ADD CONSTRAINT "harmonize_share_reviews_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "harmonize_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harmonize_reviews" ADD CONSTRAINT "harmonize_reviews_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "harmonize_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
