import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SignalType = "resonance" | "engagement" | "exposure" | "depth";

export interface SignalPayload {
  userId: string;
  targetUserId: string;
  signalType: SignalType;
  weight: number;
  metadata?: Record<string, unknown>;
}

// ─── Weights ──────────────────────────────────────────────────────────────────

export const SIGNAL_WEIGHTS = {
  witness: 0.3,
  resonated: 0.5,
  analyze: 0.8,
  exposure: 0.1,
  resonance_overlap: 0.4,
  depth_similarity: 0.2,
} as const;

// ─── Core writer ─────────────────────────────────────────────────────────────

/**
 * Appends a single relational signal row.
 * Append-only — never updates existing rows.
 * Non-blocking: caller does not need to await this.
 * Silently swallows errors so signal writes never break main flows.
 */
export async function writeSignal(payload: SignalPayload): Promise<void> {
  try {
    if (payload.userId === payload.targetUserId) return;

    await prisma.relational_signals.create({
      data: {
        user_id: payload.userId,
        target_user_id: payload.targetUserId,
        signal_type: payload.signalType,
        weight: payload.weight,
        metadata: payload.metadata ?? null,
      },
    });
  } catch {
    // Silent — signal writes must never surface errors to the user
  }
}

// ─── Hook: reaction ───────────────────────────────────────────────────────────

/**
 * Called after a user applies witness or resonated to a completion.
 * Writes an engagement signal toward the completion author.
 */
export async function signalReaction(
  reactingUserId: string,
  completionId: string,
  reactionType: "witness" | "resonated"
): Promise<void> {
  try {
    const completion = await prisma.prompt_completions.findUnique({
      where: { id: completionId },
      select: { user_id: true },
    });

    if (!completion) return;

    writeSignal({
      userId: reactingUserId,
      targetUserId: completion.user_id,
      signalType: "engagement",
      weight:
        reactionType === "resonated"
          ? SIGNAL_WEIGHTS.resonated
          : SIGNAL_WEIGHTS.witness,
      metadata: { reaction_type: reactionType, completion_id: completionId },
    });
  } catch {
    // Silent
  }
}

// ─── Hook: analyze ────────────────────────────────────────────────────────────

/**
 * Called after a user submits an analysis on another user's completion.
 * Writes a higher-weight engagement signal.
 */
export async function signalAnalyze(
  authorUserId: string,
  completionId: string
): Promise<void> {
  try {
    const completion = await prisma.prompt_completions.findUnique({
      where: { id: completionId },
      select: { user_id: true },
    });

    if (!completion) return;

    writeSignal({
      userId: authorUserId,
      targetUserId: completion.user_id,
      signalType: "engagement",
      weight: SIGNAL_WEIGHTS.analyze,
      metadata: { interaction: "analyze", completion_id: completionId },
    });
  } catch {
    // Silent
  }
}

// ─── Hook: reflection resonance ───────────────────────────────────────────────

/**
 * Called after a user submits a prompt completion.
 * Compares the new response against other completions for the same prompt.
 * Writes a low-weight resonance signal for each user whose response shares
 * detected themes with the new response.
 *
 * Heuristic only — keyword overlap across THEME_CLUSTERS.
 * Non-blocking fire-and-forget.
 */
export async function signalResonanceOnCompletion(
  userId: string,
  promptId: string,
  newResponse: string
): Promise<void> {
  try {
    const otherCompletions = await prisma.prompt_completions.findMany({
      where: {
        prompt_id: promptId,
        user_id: { not: userId },
      },
      select: { user_id: true, response: true },
      take: 50,
    });

    if (otherCompletions.length === 0) return;

    const newThemes = detectThemes(newResponse);
    if (newThemes.size === 0) return;

    for (const other of otherCompletions) {
      const otherThemes = detectThemes(other.response);
      const overlap = [...newThemes].filter((t) => otherThemes.has(t));

      if (overlap.length >= 2) {
        writeSignal({
          userId,
          targetUserId: other.user_id,
          signalType: "resonance",
          weight: SIGNAL_WEIGHTS.resonance_overlap,
          metadata: { shared_themes: overlap, prompt_id: promptId },
        });
      }
    }
  } catch {
    // Silent
  }
}

// ─── Hook: depth alignment ────────────────────────────────────────────────────

/**
 * Called after a user submits a prompt completion.
 * Compares word count depth against other completions for the same prompt.
 * Writes a low-weight depth signal for users with similar reflection depth.
 *
 * Depth buckets: short (<40 words), medium (40–100), deep (100+)
 */
export async function signalDepthAlignment(
  userId: string,
  promptId: string,
  newResponse: string
): Promise<void> {
  try {
    const newDepth = depthBucket(newResponse);

    const otherCompletions = await prisma.prompt_completions.findMany({
      where: {
        prompt_id: promptId,
        user_id: { not: userId },
      },
      select: { user_id: true, response: true },
      take: 50,
    });

    for (const other of otherCompletions) {
      if (depthBucket(other.response) === newDepth) {
        writeSignal({
          userId,
          targetUserId: other.user_id,
          signalType: "depth",
          weight: SIGNAL_WEIGHTS.depth_similarity,
          metadata: { depth_bucket: newDepth, prompt_id: promptId },
        });
      }
    }
  } catch {
    // Silent
  }
}

// ─── Theme detection (internal) ───────────────────────────────────────────────

const THEME_KEYWORDS: Record<string, string[]> = {
  control: ["control", "certain", "predictable", "plan", "manage", "secure"],
  belonging: ["belong", "accepted", "included", "valued", "seen", "fit in"],
  exhaustion: ["tired", "exhausted", "drained", "overwhelmed", "burned out"],
  connection: ["close", "together", "connected", "lonely", "isolated", "alone"],
  worth: ["enough", "worthy", "prove", "deserve", "earned", "fail"],
  change: ["change", "stuck", "repeat", "pattern", "shift", "resist"],
  trust: ["trust", "guard", "vulnerable", "honest", "hide", "reveal"],
  identity: ["real self", "mask", "authentic", "who i am", "perform", "true"],
};

function detectThemes(text: string): Set<string> {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.add(theme);
    }
  }
  return found;
}

function depthBucket(text: string): "short" | "medium" | "deep" {
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < 40) return "short";
  if (wordCount <= 100) return "medium";
  return "deep";
}