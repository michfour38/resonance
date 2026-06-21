-- CreateTable
CREATE TABLE "witness_feedback" (
    "id" TEXT NOT NULL,
    "cycle_id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "latest_answer" TEXT NOT NULL,
    "witness_reply" TEXT,
    "strongest_anchor" TEXT,
    "strongest_signal" TEXT,
    "feedback" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "witness_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "witness_feedback_cycle_id_idx" ON "witness_feedback"("cycle_id");

-- CreateIndex
CREATE INDEX "witness_feedback_participant_id_idx" ON "witness_feedback"("participant_id");

-- AddForeignKey
ALTER TABLE "witness_feedback" ADD CONSTRAINT "witness_feedback_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "harmonize_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
