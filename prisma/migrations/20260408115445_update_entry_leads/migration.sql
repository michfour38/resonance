-- AlterTable
ALTER TABLE "entry_leads" ADD COLUMN     "entered_journey_at" TIMESTAMPTZ(6),
ADD COLUMN     "intro_completed_at" TIMESTAMPTZ(6),
ADD COLUMN     "intro_started_at" TIMESTAMPTZ(6),
ADD COLUMN     "last_seen_panel" INTEGER,
ADD COLUMN     "last_seen_panel_at" TIMESTAMPTZ(6),
ADD COLUMN     "last_seen_panel_key" TEXT;

-- CreateIndex
CREATE INDEX "entry_leads_last_seen_panel_idx" ON "entry_leads"("last_seen_panel");
