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
CREATE INDEX "prewave_responses_cohort_id_idx" ON "prewave_responses"("cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "prewave_responses_user_id_cohort_id_question_index_key" ON "prewave_responses"("user_id", "cohort_id", "question_index");
