import {
  getPriorityAnchor,
  type AnchorPriorityReason,
} from "./witness-anchor-priority"
import type { StoredWitnessAnchor } from "./witness-anchor-store"

export type WitnessSignalDirection = {
  anchor: StoredWitnessAnchor | null
  reason: AnchorPriorityReason | "no_anchor"
  nextQuestion: string
}

export function followWitnessSignal(
  anchors: StoredWitnessAnchor[],
): WitnessSignalDirection {
  const priority = getPriorityAnchor(anchors)

  if (!priority) {
    return {
      anchor: null,
      reason: "no_anchor",
      nextQuestion: "Tell me what happened.",
    }
  }

  return {
    anchor: priority.anchor,
    reason: priority.reason,
    nextQuestion: "Tell me what happened.",
  }
}