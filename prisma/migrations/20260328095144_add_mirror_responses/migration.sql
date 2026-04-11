-- CreateTable
CREATE TABLE "mirror_responses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,
    "day_number" INTEGER NOT NULL,
    "input_snapshot" JSONB NOT NULL,
    "output" TEXT NOT NULL,
    "patterns_detected" TEXT[],
    "contradictions" TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mirror_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mirror_responses_user_id_idx" ON "mirror_responses"("user_id");

-- CreateIndex
CREATE INDEX "mirror_responses_user_id_week_number_day_number_idx" ON "mirror_responses"("user_id", "week_number", "day_number");

-- CreateIndex
CREATE UNIQUE INDEX "mirror_responses_user_id_week_number_day_number_key" ON "mirror_responses"("user_id", "week_number", "day_number");

-- AddForeignKey
ALTER TABLE "mirror_responses" ADD CONSTRAINT "mirror_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
