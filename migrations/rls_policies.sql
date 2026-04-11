-- =============================================================================
-- Supabase RLS Policies
-- Apply via Supabase SQL editor after all migrations are confirmed.
--
-- Architecture notes:
--
-- 1. Admin access uses the service_role key server-side (tRPC adminProc).
--    The service_role key bypasses RLS entirely. No admin RLS policies needed.
--    NEVER expose service_role key to the browser.
--
-- 2. All tRPC mutations that change lifecycle state (cohort activation, room
--    unlock, journey_status transitions) run server-side with the service_role
--    client. RLS policies here cover the authenticated user (anon role) only.
--
-- 3. Read-only tables (rooms, cohorts, circles, insight_definitions) are
--    served via server-side API routes only — no direct client Supabase calls.
--    RLS not strictly required on these, but enabled as defence-in-depth.
--
-- Test after applying:
--   Use Supabase client with a real user JWT and verify:
--   - Cannot SELECT another user's reflection_sessions (returns 0 rows)
--   - Cannot SELECT another user's journal_entries (returns 0 rows)
--   - Cannot INSERT reflection_session for another user_id
-- =============================================================================

-- =============================================================================
-- Enable RLS
-- =============================================================================

ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_sessions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_posts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_prompts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports              ENABLE ROW LEVEL SECURITY;

-- Defence-in-depth on read-only tables
ALTER TABLE rooms                ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_definitions  ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- profiles
-- =============================================================================

-- Users read and update their own profile only.
-- INSERT is done server-side with service_role — no client INSERT policy.
CREATE POLICY "profiles: own select"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles: own update"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    -- Prevent client from elevating their own is_admin flag.
    -- Admin status is only set by service_role procedures.
    AND is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- =============================================================================
-- cohort_members
-- =============================================================================

-- Users see only their own membership row(s).
-- No client INSERT/UPDATE — managed by adminProc (service_role).
CREATE POLICY "cohort_members: own select"
  ON cohort_members FOR SELECT
  USING (user_id = auth.uid());

-- =============================================================================
-- circle_members
-- =============================================================================

CREATE POLICY "circle_members: own select"
  ON circle_members FOR SELECT
  USING (user_id = auth.uid());

-- Users may view other members of their own circle (for member list UI).
CREATE POLICY "circle_members: same circle select"
  ON circle_members FOR SELECT
  USING (
    circle_id IN (
      SELECT circle_id FROM circle_members WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- journey_progress
-- =============================================================================

-- Read only. All writes are server-side (syncUnlocks, activateCohort, adminProc).
CREATE POLICY "journey_progress: own select"
  ON journey_progress FOR SELECT
  USING (user_id = auth.uid());

-- =============================================================================
-- reflection_sessions
-- =============================================================================

CREATE POLICY "reflection_sessions: own select"
  ON reflection_sessions FOR SELECT
  USING (user_id = auth.uid());

-- Client may create sessions but only for themselves.
-- activeProc middleware enforces journey_status = active before this is reached.
CREATE POLICY "reflection_sessions: own insert"
  ON reflection_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reflection_sessions: own update"
  ON reflection_sessions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- reflection_messages
-- =============================================================================

-- Access is through session ownership, not direct user_id.
-- This prevents a user from probing message IDs from other sessions.
CREATE POLICY "reflection_messages: own session select"
  ON reflection_messages FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM reflection_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "reflection_messages: own session insert"
  ON reflection_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM reflection_sessions WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- inquiry_sessions
-- =============================================================================

CREATE POLICY "inquiry_sessions: own session select"
  ON inquiry_sessions FOR SELECT
  USING (
    reflection_session_id IN (
      SELECT id FROM reflection_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "inquiry_sessions: own session insert"
  ON inquiry_sessions FOR INSERT
  WITH CHECK (
    reflection_session_id IN (
      SELECT id FROM reflection_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "inquiry_sessions: own session update"
  ON inquiry_sessions FOR UPDATE
  USING (
    reflection_session_id IN (
      SELECT id FROM reflection_sessions WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- journal_entries
-- =============================================================================

CREATE POLICY "journal_entries: own select"
  ON journal_entries FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "journal_entries: own insert"
  ON journal_entries FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "journal_entries: own update"
  ON journal_entries FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "journal_entries: own delete"
  ON journal_entries FOR DELETE
  USING (user_id = auth.uid());

-- =============================================================================
-- circle_posts
-- =============================================================================

-- Read: any member of the same circle may read non-deleted posts.
CREATE POLICY "circle_posts: circle member select"
  ON circle_posts FOR SELECT
  USING (
    deleted_at IS NULL
    AND circle_id IN (
      SELECT circle_id FROM circle_members WHERE user_id = auth.uid()
    )
  );

-- Insert: circle membership is required.
-- Additional pre-start restrictions (intro-only) are enforced in tRPC circleRouter.
-- RLS here is the backstop: blocks non-members entirely.
CREATE POLICY "circle_posts: circle member insert"
  ON circle_posts FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND circle_id IN (
      SELECT circle_id FROM circle_members WHERE user_id = auth.uid()
    )
  );

-- Update: own posts only (for soft-delete).
CREATE POLICY "circle_posts: own update"
  ON circle_posts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- circle_prompts
-- =============================================================================

-- Read: circle members see prompts for their circle.
-- Pre-start restriction (intro-only) is enforced in tRPC circleRouter, not RLS.
CREATE POLICY "circle_prompts: circle member select"
  ON circle_prompts FOR SELECT
  USING (
    circle_id IN (
      SELECT circle_id FROM circle_members WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- user_insights
-- =============================================================================

CREATE POLICY "user_insights: own select"
  ON user_insights FOR SELECT
  USING (user_id = auth.uid());

-- =============================================================================
-- notifications
-- =============================================================================

CREATE POLICY "notifications: own select"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users may mark their own notifications as read.
CREATE POLICY "notifications: own update"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- reports
-- =============================================================================

-- Users may file reports.
CREATE POLICY "reports: own insert"
  ON reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- Users may view reports they filed.
CREATE POLICY "reports: own select"
  ON reports FOR SELECT
  USING (reporter_id = auth.uid());

-- Admin reads all reports via service_role (bypasses RLS).

-- =============================================================================
-- Read-only tables: allow authenticated users to read
-- (served via server API in practice; these are defence-in-depth)
-- =============================================================================

CREATE POLICY "rooms: authenticated read"
  ON rooms FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "cohorts: authenticated read"
  ON cohorts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "circles: authenticated read"
  ON circles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "insight_definitions: authenticated read"
  ON insight_definitions FOR SELECT
  USING (auth.role() = 'authenticated');

-- =============================================================================
-- Verification queries
-- =============================================================================

-- Run these to confirm RLS is active on all tables:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'cohort_members', 'circle_members', 'journey_progress',
    'reflection_sessions', 'reflection_messages', 'inquiry_sessions',
    'journal_entries', 'circle_posts', 'circle_prompts', 'user_insights',
    'notifications', 'reports', 'rooms', 'cohorts', 'circles', 'insight_definitions'
  )
ORDER BY tablename;
-- Expected: rowsecurity = true for all rows above.
