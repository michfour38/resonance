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

-- CreateIndex
CREATE INDEX "wave_name_votes_cohort_id_idx" ON "wave_name_votes"("cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "wave_name_votes_user_id_cohort_id_key" ON "wave_name_votes"("user_id", "cohort_id");
