-- CreateTable
CREATE TABLE "prompt_analyses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "completion_id" UUID NOT NULL,
    "author_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "prompt_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_analyses_completion_id_idx" ON "prompt_analyses"("completion_id");

-- CreateIndex
CREATE INDEX "prompt_analyses_author_id_idx" ON "prompt_analyses"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_analyses_completion_id_author_id_key" ON "prompt_analyses"("completion_id", "author_id");

-- AddForeignKey
ALTER TABLE "prompt_analyses" ADD CONSTRAINT "prompt_analyses_completion_id_fkey" FOREIGN KEY ("completion_id") REFERENCES "prompt_completions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_analyses" ADD CONSTRAINT "prompt_analyses_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
