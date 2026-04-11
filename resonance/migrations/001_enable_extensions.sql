-- =============================================================================
-- Migration 001: enable_extensions
-- Run once on a fresh database before running `npx prisma migrate dev`.
-- Required for gen_random_uuid() used throughout the schema.
-- On Railway: run via the Railway SQL console or psql.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Confirm
SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto', 'uuid-ossp');
