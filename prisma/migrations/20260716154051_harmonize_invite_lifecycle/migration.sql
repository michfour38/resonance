/*
  Warnings:

  - The values [incomplete] on the enum `HarmonizeCycleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HarmonizeCycleStatus_new" AS ENUM ('active', 'paused', 'review_due', 'reviewed', 'archived');
ALTER TABLE "harmonize_cycles" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "harmonize_cycles" ALTER COLUMN "status" TYPE "HarmonizeCycleStatus_new" USING ("status"::text::"HarmonizeCycleStatus_new");
ALTER TYPE "HarmonizeCycleStatus" RENAME TO "HarmonizeCycleStatus_old";
ALTER TYPE "HarmonizeCycleStatus_new" RENAME TO "HarmonizeCycleStatus";
DROP TYPE "HarmonizeCycleStatus_old";
ALTER TABLE "harmonize_cycles" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- AlterTable
ALTER TABLE "harmonize_invites" ADD COLUMN     "accepted_by_profile_id" TEXT,
ADD COLUMN     "consent_acknowledged_at" TIMESTAMPTZ(6),
ADD COLUMN     "expires_at" TIMESTAMPTZ(6),
ADD COLUMN     "revoked_at" TIMESTAMPTZ(6);

-- CreateIndex
CREATE INDEX "harmonize_invites_system_id_status_idx" ON "harmonize_invites"("system_id", "status");
