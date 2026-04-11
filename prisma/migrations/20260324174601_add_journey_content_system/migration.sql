-- CreateEnum
CREATE TYPE "PromptType" AS ENUM ('thread_prompt', 'mirror_exercise');

-- CreateTable
CREATE TABLE "post_witnesses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_witnesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_weeks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "room_id" UUID NOT NULL,
    "week_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journey_weeks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_days" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "week_id" UUID NOT NULL,
    "day_number" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journey_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_prompts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "day_id" UUID NOT NULL,
    "type" "PromptType" NOT NULL,
    "prompt_order" INTEGER NOT NULL,
    "label" TEXT,
    "content" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "day_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_completions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "is_shared" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "prompt_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_witnesses_post_id_idx" ON "post_witnesses"("post_id");

-- CreateIndex
CREATE INDEX "post_witnesses_user_id_idx" ON "post_witnesses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_witnesses_post_id_user_id_key" ON "post_witnesses"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "journey_weeks_room_id_key" ON "journey_weeks"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "journey_weeks_week_number_key" ON "journey_weeks"("week_number");

-- CreateIndex
CREATE INDEX "journey_weeks_week_number_idx" ON "journey_weeks"("week_number");

-- CreateIndex
CREATE INDEX "journey_days_week_id_idx" ON "journey_days"("week_id");

-- CreateIndex
CREATE UNIQUE INDEX "journey_days_week_id_day_number_key" ON "journey_days"("week_id", "day_number");

-- CreateIndex
CREATE INDEX "day_prompts_day_id_prompt_order_idx" ON "day_prompts"("day_id", "prompt_order");

-- CreateIndex
CREATE INDEX "prompt_completions_prompt_id_idx" ON "prompt_completions"("prompt_id");

-- CreateIndex
CREATE INDEX "prompt_completions_user_id_idx" ON "prompt_completions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_completions_prompt_id_user_id_key" ON "prompt_completions"("prompt_id", "user_id");

-- AddForeignKey
ALTER TABLE "post_witnesses" ADD CONSTRAINT "post_witnesses_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "circle_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_witnesses" ADD CONSTRAINT "post_witnesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_weeks" ADD CONSTRAINT "journey_weeks_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_days" ADD CONSTRAINT "journey_days_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "journey_weeks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day_prompts" ADD CONSTRAINT "day_prompts_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "journey_days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_completions" ADD CONSTRAINT "prompt_completions_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "day_prompts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_completions" ADD CONSTRAINT "prompt_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
