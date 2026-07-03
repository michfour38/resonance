-- CreateTable
CREATE TABLE "harmonize_invites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "system_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "relationship_context" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMPTZ(6),

    CONSTRAINT "harmonize_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "harmonize_invites_system_id_idx" ON "harmonize_invites"("system_id");

-- CreateIndex
CREATE INDEX "harmonize_invites_email_idx" ON "harmonize_invites"("email");

-- CreateIndex
CREATE INDEX "harmonize_invites_status_idx" ON "harmonize_invites"("status");

-- AddForeignKey
ALTER TABLE "harmonize_invites" ADD CONSTRAINT "harmonize_invites_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "harmonize_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
