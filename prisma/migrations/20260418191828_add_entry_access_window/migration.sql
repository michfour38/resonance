-- AlterTable
ALTER TABLE "entry_leads" ADD COLUMN     "entry_access_expires_at" TIMESTAMPTZ(6),
ADD COLUMN     "entry_paid_at" TIMESTAMPTZ(6);
