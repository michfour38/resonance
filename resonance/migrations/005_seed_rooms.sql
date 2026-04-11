-- =============================================================================
-- Migration 005: seed_rooms
-- Apply via Supabase SQL editor after migration 004.
-- Static data — never modified after initial deployment.
-- week_number drives all scheduled_unlock_at calculations.
-- =============================================================================

INSERT INTO rooms (id, slug, name, week_number, theme, is_integration) VALUES
  (gen_random_uuid(), 'hearth',        'The Hearth',    1,  'Belonging and relational safety',       false),
  (gen_random_uuid(), 'mirror',        'The Mirror',    2,  'Relational self-awareness',              false),
  (gen_random_uuid(), 'garden',        'The Garden',    3,  'Relational nourishment',                 false),
  (gen_random_uuid(), 'compass',       'The Compass',   4,  'Values and direction',                   false),
  (gen_random_uuid(), 'pulse',         'The Pulse',     5,  'Attraction and relational energy',       false),
  (gen_random_uuid(), 'shadow',        'The Shadow',    6,  'Emotional triggers and fear',            false),
  (gen_random_uuid(), 'forge',         'The Forge',     7,  'Conflict and repair',                    false),
  (gen_random_uuid(), 'vision',        'The Vision',    8,  'Conscious relationship design',          false),
  (gen_random_uuid(), 'integration_1', 'Integration I', 9,  'Weaving the journey together',          true),
  (gen_random_uuid(), 'integration_2', 'Integration II',10, 'Carrying insights forward',             true)
ON CONFLICT (slug) DO NOTHING;

-- Verify
SELECT slug, name, week_number, is_integration
FROM rooms
ORDER BY week_number;
