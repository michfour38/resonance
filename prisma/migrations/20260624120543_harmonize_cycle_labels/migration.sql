-- CreateTable
CREATE TABLE "harmonize_cycle_labels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cycle_id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "harmonize_cycle_labels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "harmonize_cycle_labels_cycle_id_idx" ON "harmonize_cycle_labels"("cycle_id");

-- CreateIndex
CREATE INDEX "harmonize_cycle_labels_participant_id_idx" ON "harmonize_cycle_labels"("participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "harmonize_cycle_labels_cycle_id_participant_id_key" ON "harmonize_cycle_labels"("cycle_id", "participant_id");

-- AddForeignKey
ALTER TABLE "harmonize_cycle_labels" ADD CONSTRAINT "harmonize_cycle_labels_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "harmonize_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harmonize_cycle_labels" ADD CONSTRAINT "harmonize_cycle_labels_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "harmonize_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
