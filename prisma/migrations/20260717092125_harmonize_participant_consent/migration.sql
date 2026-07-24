-- AlterTable
ALTER TABLE "harmonize_participants" ADD COLUMN     "consent_acknowledged_at" TIMESTAMPTZ(6),
ADD COLUMN     "consent_snapshot" JSONB NOT NULL DEFAULT '{}';
