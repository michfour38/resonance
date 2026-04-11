-- =============================================================================
-- Migration 004: auth_linkage_and_triggers
-- Apply via Supabase SQL editor after migration 003.
-- =============================================================================

-- ── 1. Foreign key: profiles → auth.users ────────────────────────────────────
-- Prisma cannot reference auth.users (it's in a different schema).
-- ON DELETE CASCADE: if a Supabase auth user is deleted, their profile is too.

ALTER TABLE profiles
  ADD CONSTRAINT fk_profiles_auth_users
  FOREIGN KEY (id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE;

-- ── 2. updated_at trigger function ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── 3. Apply trigger to all mutable tables ────────────────────────────────────

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

-- ── 4. Verify ─────────────────────────────────────────────────────────────────

SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
