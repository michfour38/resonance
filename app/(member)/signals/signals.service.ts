// Signals are temporarily disabled for this build because the
// relational_signals table/model is not present in the current Prisma client.

export type SignalType = "resonance" | "engagement" | "exposure" | "depth";

export interface SignalPayload {
  userId: string;
  targetUserId: string;
  signalType: SignalType;
  weight: number;
  metadata?: Record<string, unknown>;
}

export const SIGNAL_WEIGHTS = {
  witness: 0.3,
  resonated: 0.5,
  analyze: 0.8,
  exposure: 0.1,
  resonance_overlap: 0.4,
  depth_similarity: 0.2,
} as const;

export async function writeSignal(_payload: SignalPayload): Promise<void> {
  return;
}

export async function signalReaction(
  _reactingUserId: string,
  _completionId: string,
  _reactionType: "witness" | "resonated"
): Promise<void> {
  return;
}

export async function signalAnalyze(
  _authorUserId: string,
  _completionId: string
): Promise<void> {
  return;
}

export async function signalResonanceOnCompletion(
  _userId: string,
  _promptId: string,
  _newResponse: string
): Promise<void> {
  return;
}

export async function signalDepthAlignment(
  _userId: string,
  _promptId: string,
  _newResponse: string
): Promise<void> {
  return;
}