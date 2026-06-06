export type HarmonizeReviewOutcome =
  | "integration"
  | "repetition"
  | "mimicry"
  | "incomplete"

type ReviewInput = {
  hasOwnershipSignal: boolean
  hasPossibilitySignal: boolean
  hasPauseReflection: boolean
  pauseWasReflective: boolean
}

export function inferReviewOutcome(input: ReviewInput): HarmonizeReviewOutcome {
  if (input.hasOwnershipSignal && input.hasPossibilitySignal) {
    return "integration"
  }

  if (input.hasPauseReflection && input.pauseWasReflective) {
    return "integration"
  }

  if (input.hasPauseReflection && !input.pauseWasReflective) {
    return "repetition"
  }

  return "incomplete"
}