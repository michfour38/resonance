-- CreateTable
CREATE TABLE "mirror_feedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,
    "day_number" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mirror_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mirror_feedback_user_id_idx" ON "mirror_feedback"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mirror_feedback_user_id_week_number_day_number_key" ON "mirror_feedback"("user_id", "week_number", "day_number");
