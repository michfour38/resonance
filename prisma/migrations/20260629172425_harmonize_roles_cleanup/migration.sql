/*
  Warnings:

  - The values [sibling,colleague] on the enum `HarmonizeRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HarmonizeRole_new" AS ENUM ('partner', 'parent', 'child', 'sibling', 'friend', 'colleague', 'client', 'coach', 'other');
ALTER TABLE "harmonize_participants" ALTER COLUMN "role" TYPE "HarmonizeRole_new" USING ("role"::text::"HarmonizeRole_new");
ALTER TYPE "HarmonizeRole" RENAME TO "HarmonizeRole_old";
ALTER TYPE "HarmonizeRole_new" RENAME TO "HarmonizeRole";
DROP TYPE "HarmonizeRole_old";
COMMIT;
