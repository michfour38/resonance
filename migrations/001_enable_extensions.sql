-- =============================================================================
-- Migration 001: enable_extensions
-- Run once on a fresh Supabase project via the SQL editor before running
-- `npx prisma migrate dev`. Supabase projects have these available but they
-- must be enabled per-schema.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Confirm
SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto', 'uuid-ossp');
