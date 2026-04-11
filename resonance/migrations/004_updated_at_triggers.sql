-- =============================================================================
-- Migration 004: updated_at triggers
-- Apply via Railway SQL console or psql after migration 003.
--
-- Note: The original 004 also contained a FK from profiles to auth.users
-- (Supabase-specific). That constraint is not needed with Railway + Clerk.
-- Clerk manages auth identity externally; Prisma owns the profiles table fully.
-- =============================================================================

-- ── Trigger function ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Apply to all mutable tables ───────────────────────────────────────────────

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_cohorts_updated_at
  BEFORE UPDATE ON cohorts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_inquiry_sessions_updated_at
  BEFORE UPDATE ON inquiry_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_circle_posts_updated_at
  BEFORE UPDATE ON circle_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Verify ────────────────────────────────────────────────────────────────────

SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
