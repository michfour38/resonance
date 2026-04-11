/*
  Warnings:

  - You are about to drop the column `completed_at` on the `cohort_members` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `cohort_members` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `cohort_members` table. All the data in the column will be lost.
  - You are about to drop the `cohort_day_completions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mirror_unlocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prewave_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wave_name_votes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('resonance', 'engagement', 'exposure', 'depth');

-- DropForeignKey
ALTER TABLE "cohort_day_completions" DROP CONSTRAINT "cohort_day_completions_cohort_id_fkey";

-- DropForeignKey
ALTER TABLE "cohort_day_completions" DROP CONSTRAINT "cohort_day_completions_user_id_fkey";

-- DropIndex
DROP INDEX "cohort_members_state_idx";

-- AlterTable
ALTER TABLE "cohort_members" DROP COLUMN "completed_at",
DROP COLUMN "joined_at",
DROP COLUMN "state";

-- DropTable
DROP TABLE "cohort_day_completions";

-- DropTable
DROP TABLE "mirror_unlocks";

-- DropTable
DROP TABLE "prewave_responses";

-- DropTable
DROP TABLE "wave_name_votes";

-- DropEnum
DROP TYPE "CohortMembershipState";

-- CreateTable
CREATE TABLE "relational_signals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "target_user_id" TEXT NOT NULL,
    "signal_type" "SignalType" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relational_signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "relational_signals_user_id_idx" ON "relational_signals"("user_id");

-- CreateIndex
CREATE INDEX "relational_signals_target_user_id_idx" ON "relational_signals"("target_user_id");

-- CreateIndex
CREATE INDEX "relational_signals_user_id_target_user_id_idx" ON "relational_signals"("user_id", "target_user_id");

-- AddForeignKey
ALTER TABLE "relational_signals" ADD CONSTRAINT "relational_signals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relational_signals" ADD CONSTRAINT "relational_signals_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
