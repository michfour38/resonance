CREATE TABLE "oremea_entitlements" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL,
  "product_key" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "source" TEXT,
  "source_reference" TEXT,
  "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMPTZ(6),
  "revoked_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "oremea_entitlements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "oremea_entitlements_user_id_product_key_key"
  ON "oremea_entitlements"("user_id", "product_key");

CREATE INDEX "oremea_entitlements_user_id_idx"
  ON "oremea_entitlements"("user_id");

CREATE INDEX "oremea_entitlements_product_key_idx"
  ON "oremea_entitlements"("product_key");

CREATE INDEX "oremea_entitlements_status_idx"
  ON "oremea_entitlements"("status");

CREATE TABLE "resonance_day_guidance" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL,
  "week_number" INTEGER NOT NULL,
  "day_number" INTEGER NOT NULL,
  "question_one" TEXT NOT NULL,
  "question_two" TEXT NOT NULL,
  "answer_one" TEXT,
  "answer_two" TEXT,
  "input_snapshot" JSONB NOT NULL DEFAULT '{}',
  "generated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "answered_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "resonance_day_guidance_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "resonance_day_guidance_user_id_week_number_day_number_key"
  ON "resonance_day_guidance"("user_id", "week_number", "day_number");

CREATE INDEX "resonance_day_guidance_user_id_idx"
  ON "resonance_day_guidance"("user_id");

CREATE INDEX "resonance_day_guidance_week_number_day_number_idx"
  ON "resonance_day_guidance"("week_number", "day_number");
