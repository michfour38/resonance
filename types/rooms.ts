// types/rooms.ts
// Type definitions for config/rooms.json
// These types are used by lib/getRoomConfig.ts and the AI prompt builder.

export type WorldviewKey =
  | 'psychological'
  | 'spiritual'
  | 'analytical'
  | 'somatic'
  | 'philosophical'
  | 'practical';

export type PathwayKey = 'discover' | 'relate' | 'harmonize';

export interface RoomConfig {
  /** Matches rooms.slug in the database. Used as the primary lookup key. */
  slug: string;

  /** Display name. E.g. "The Hearth". */
  name: string;

  /** 1–10. Must match rooms.week_number in the database. */
  weekNumber: number;

  /** Short theme description. Shown on room cards and dashboard. */
  theme: string;

  /** True for weeks 9–10 (Integration I and II). */
  isIntegration: boolean;

  /**
   * Shown on the Room detail page before the user starts a session.
   * Sets the frame for the week without prescribing the reflection.
   */
  openingCopy: string;

  /**
   * The primary weekly question. Injected into the AI session prompt as
   * the framing for the reflection. Always shown on the Room page.
   */
  weeklyFocus: string;

  /**
   * Pathway-specific framing that modifies the AI context injection.
   * Pathways are overlays on the same core journey — not separate content.
   * These strings are appended to the room context prompt layer.
   */
  pathwayOverlay: Record<PathwayKey, string>;

  /**
   * Keyword/phrase list for trigger detection in user messages.
   * Matched via simple substring check in detectSignals().
   * A match may prompt the AI to deepen or initiate inquiry.
   */
  signalPhrases: string[];

  /**
   * Phrases that suggest the user may be ready for the seven-layer inquiry.
   * Subset of signalPhrases — higher confidence signals.
   * Matched in the same detectSignals() utility.
   */
  inquiryEntryHints: string[];
}

export interface RoomsConfig {
  rooms: RoomConfig[];
}
