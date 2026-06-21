import { defineAnchorFromEntry } from "./anchor-definition-engine"

export type WitnessAnchorShift = {
  shouldShift: boolean
  previousAnchor: string | null
  nextAnchor: string | null
}

export function detectAnchorShift(params: {
  previousAnchor: string | null
  latestEntry: string
}) : WitnessAnchorShift {
  const nextDefinition = defineAnchorFromEntry(params.latestEntry)

  if (!nextDefinition) {
    return {
      shouldShift: false,
      previousAnchor: params.previousAnchor,
      nextAnchor: null,
    }
  }

  if (!params.previousAnchor) {
    return {
      shouldShift: true,
      previousAnchor: null,
      nextAnchor: nextDefinition.anchor,
    }
  }

  if (nextDefinition.anchor !== params.previousAnchor) {
    return {
      shouldShift: true,
      previousAnchor: params.previousAnchor,
      nextAnchor: nextDefinition.anchor,
    }
  }

  return {
    shouldShift: false,
    previousAnchor: params.previousAnchor,
    nextAnchor: nextDefinition.anchor,
  }
}