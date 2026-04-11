-- =============================================================================
-- Migration 003: partial_indexes_and_constraints
-- Apply via Supabase SQL editor AFTER `npx prisma migrate dev` completes.
-- Prisma cannot express partial unique indexes. These must be raw SQL.
-- =============================================================================

-- ── 1. One intro prompt per circle ──────────────────────────────────────────
-- Enforces the canonical rule: exactly one is_intro prompt per Circle.
-- The tRPC circleRouter also checks this, but the DB constraint is the backstop.

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_intro_per_circle
  ON circle_prompts (circle_id)
  WHERE is_intro = true;

-- ── 2. Locked room unlock index ───────────────────────────────────────────────
-- Used by journey.syncUnlocks to find rows that need status promotion.
-- Partial: only indexes locked rows, shrinks as the journey progresses.

CREATE INDEX IF NOT EXISTS idx_jp_unlock_locked
  ON journey_progress (scheduled_unlock_at)
  WHERE status = 'locked';

-- ── 3. Unread notifications index ────────────────────────────────────────────
-- Used by notification bell query (unread count + recent unread list).

CREATE INDEX IF NOT EXISTS idx_notifications_unread
  ON notifications (user_id)
  WHERE read = false;

-- ── 4. Live circle posts index ────────────────────────────────────────────────
-- Used by all circle post feed queries. Excludes soft-deleted rows.

CREATE INDEX IF NOT EXISTS idx_circle_posts_live
  ON circle_posts (circle_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- ── 5. Active cohort members index ───────────────────────────────────────────
-- Used by syncUnlocks and activateCohort to find members needing transitions.

CREATE INDEX IF NOT EXISTS idx_cohort_members_active
  ON cohort_members (cohort_id)
  WHERE status IN ('enrolled', 'active');

-- Verify all indexes created:
SELECT indexname, tablename, indexdef
FROM pg_indexes
WHERE indexname IN (
  'idx_one_intro_per_circle',
  'idx_jp_unlock_locked',
  'idx_notifications_unread',
  'idx_circle_posts_live',
  'idx_cohort_members_active'
)
ORDER BY tablename;
