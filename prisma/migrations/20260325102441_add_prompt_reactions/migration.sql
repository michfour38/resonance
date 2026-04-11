-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('witness', 'resonated');

-- CreateTable
CREATE TABLE "prompt_reactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "completion_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_reactions_completion_id_idx" ON "prompt_reactions"("completion_id");

-- CreateIndex
CREATE INDEX "prompt_reactions_user_id_idx" ON "prompt_reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_reactions_completion_id_user_id_type_key" ON "prompt_reactions"("completion_id", "user_id", "type");

-- AddForeignKey
ALTER TABLE "prompt_reactions" ADD CONSTRAINT "prompt_reactions_completion_id_fkey" FOREIGN KEY ("completion_id") REFERENCES "prompt_completions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_reactions" ADD CONSTRAINT "prompt_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
