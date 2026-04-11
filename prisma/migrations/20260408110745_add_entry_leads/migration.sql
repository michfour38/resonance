-- CreateTable
CREATE TABLE "entry_leads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "source" TEXT,
    "pathway" "Pathway",
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "entry_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entry_leads_email_key" ON "entry_leads"("email");

-- CreateIndex
CREATE INDEX "entry_leads_email_idx" ON "entry_leads"("email");
