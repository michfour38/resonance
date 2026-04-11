-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('private', 'requested_public', 'public');

-- AlterTable
ALTER TABLE "prompt_analyses" ADD COLUMN     "status" "AnalysisStatus" NOT NULL DEFAULT 'private';
