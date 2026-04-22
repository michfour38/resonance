-- AlterTable
ALTER TABLE "entry_leads" ADD COLUMN     "journey_access_granted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "journey_paid_at" TIMESTAMPTZ(6);
