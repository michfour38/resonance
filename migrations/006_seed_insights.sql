-- =============================================================================
-- Migration 006: seed_insights
-- Apply via Supabase SQL editor after migration 005.
-- unlock_criteria is evaluated server-side by the insight service.
-- In MVP: simple completion counters. Pattern detection deferred.
-- =============================================================================

INSERT INTO insight_definitions (id, slug, name, description, unlock_criteria) VALUES
  (
    gen_random_uuid(),
    'love_language',
    'Love Language',
    'How you most naturally give and receive love in relationships.',
    '{"min_sessions": 3, "rooms": ["hearth", "garden"]}'
  ),
  (
    gen_random_uuid(),
    'apology_language',
    'Apology Language',
    'The way you need to receive apologies — and how you offer them.',
    '{"min_sessions": 2, "rooms": ["forge"]}'
  ),
  (
    gen_random_uuid(),
    'attraction_pattern',
    'Attraction Pattern',
    'The qualities and dynamics you are consistently drawn toward.',
    '{"min_sessions": 2, "rooms": ["pulse", "mirror"]}'
  ),
  (
    gen_random_uuid(),
    'conflict_style',
    'Conflict Style',
    'Your default pattern when tension arises in close relationships.',
    '{"min_sessions": 2, "rooms": ["shadow", "forge"]}'
  ),
  (
    gen_random_uuid(),
    'emotional_regulation',
    'Emotional Regulation Style',
    'How your nervous system responds to emotional intensity.',
    '{"min_sessions": 3, "rooms": ["shadow", "mirror"]}'
  )
ON CONFLICT (slug) DO NOTHING;

-- Verify
SELECT slug, name FROM insight_definitions ORDER BY slug;
