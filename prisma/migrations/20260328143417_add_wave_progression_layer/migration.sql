-- CreateEnum
CREATE TYPE "CohortMembershipState" AS ENUM ('PRE_WAVE', 'ACTIVE', 'COMPLETED');

-- AlterTable
ALTER TABLE "cohort_members" ADD COLUMN     "completed_at" TIMESTAMPTZ(6),
ADD COLUMN     "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "state" "CohortMembershipState" NOT NULL DEFAULT 'PRE_WAVE';

-- CreateTable
CREATE TABLE "cohort_day_completions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "cohort_id" UUID NOT NULL,
    "week_number" INTEGER NOT NULL,
    "day_number" INTEGER NOT NULL,
    "completed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cohort_day_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cohort_day_completions_user_id_cohort_id_idx" ON "cohort_day_completions"("user_id", "cohort_id");

-- CreateIndex
CREATE INDEX "cohort_day_completions_cohort_id_week_number_day_number_idx" ON "cohort_day_completions"("cohort_id", "week_number", "day_number");

-- CreateIndex
CREATE UNIQUE INDEX "cohort_day_completions_user_id_cohort_id_week_number_day_nu_key" ON "cohort_day_completions"("user_id", "cohort_id", "week_number", "day_number");

-- CreateIndex
CREATE INDEX "cohort_members_state_idx" ON "cohort_members"("state");

-- AddForeignKey
ALTER TABLE "cohort_day_completions" ADD CONSTRAINT "cohort_day_completions_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_day_completions" ADD CONSTRAINT "cohort_day_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
