// lib/getRoomConfig.ts
// Loads and caches config/rooms.json.
// Used by the AI prompt builder and room detail pages.
//
// Design: rooms.json is read once at module load time (Node.js module cache).
// No runtime I/O on subsequent calls. Safe to call in tRPC procedures and
// Server Components without performance concern.

import { readFileSync } from 'fs';
import { join } from 'path';
import type { RoomConfig, RoomsConfig } from '@/types/rooms';

// Load once at module initialisation.
// path.join with process.cwd() resolves correctly in both dev and production builds.
const raw = readFileSync(join(process.cwd(), 'config', 'rooms.json'), 'utf-8');
const parsed: RoomsConfig = JSON.parse(raw);

// Indexed by slug for O(1) lookup.
const roomsBySlug = new Map<string, RoomConfig>(
  parsed.rooms.map((room) => [room.slug, room])
);

// Indexed by weekNumber for lookup by progression position.
const roomsByWeek = new Map<number, RoomConfig>(
  parsed.rooms.map((room) => [room.weekNumber, room])
);

/**
 * Returns the RoomConfig for the given slug.
 * Throws if the slug is not found — this is a programming error, not a user error.
 */
export function getRoomConfig(slug: string): RoomConfig {
  const room = roomsBySlug.get(slug);
  if (!room) {
    throw new Error(
      `getRoomConfig: no room found for slug "${slug}". ` +
      `Valid slugs: ${Array.from(roomsBySlug.keys()).join(', ')}`
    );
  }
  return room;
}

/**
 * Returns the RoomConfig for the given week number (1–10).
 * Throws if not found.
 */
export function getRoomConfigByWeek(weekNumber: number): RoomConfig {
  const room = roomsByWeek.get(weekNumber);
  if (!room) {
    throw new Error(
      `getRoomConfigByWeek: no room found for week ${weekNumber}. ` +
      `Valid weeks: 1–10`
    );
  }
  return room;
}

/**
 * Returns all room configs ordered by week number.
 */
export function getAllRoomConfigs(): RoomConfig[] {
  return parsed.rooms.slice().sort((a, b) => a.weekNumber - b.weekNumber);
}

/**
 * Returns all valid room slugs. Used for input validation in tRPC procedures.
 */
export function getValidRoomSlugs(): string[] {
  return Array.from(roomsBySlug.keys());
}
