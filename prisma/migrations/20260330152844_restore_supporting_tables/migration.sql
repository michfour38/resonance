/*
  Warnings:

  - You are about to drop the `relational_signals` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CohortMembershipState" AS ENUM ('PRE_WAVE', 'ACTIVE', 'COMPLETED', 'WITHDRAWN');

-- DropForeignKey
ALTER TABLE "relational_signals" DROP CONSTRAINT "relational_signals_target_user_id_fkey";

-- DropForeignKey
ALTER TABLE "relational_signals" DROP CONSTRAINT "relational_signals_user_id_fkey";

-- DropTable
DROP TABLE "relational_signals";

-- DropEnum
DROP TYPE "SignalType";

-- CreateTable
CREATE TABLE "mirror_unlocks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,
    "day_number" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "unlocked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mirror_unlocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wave_name_votes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "wave_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wave_name_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prewave_responses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "question_index" INTEGER NOT NULL,
    "response" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prewave_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mirror_unlocks_user_id_week_number_day_number_tier_key" ON "mirror_unlocks"("user_id", "week_number", "day_number", "tier");

-- CreateIndex
CREATE INDEX "wave_name_votes_cohort_id_idx" ON "wave_name_votes"("cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "wave_name_votes_user_id_cohort_id_key" ON "wave_name_votes"("user_id", "cohort_id");

-- CreateIndex
CREATE INDEX "prewave_responses_cohort_id_idx" ON "prewave_responses"("cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "prewave_responses_user_id_cohort_id_question_index_key" ON "prewave_responses"("user_id", "cohort_id", "question_index");
