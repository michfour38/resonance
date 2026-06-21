import type { AnchorDefinition } from "./anchor-definition-engine"

type BuildWitnessQuestionInput = {
  anchor: AnchorDefinition
  latestEntry: string
  previousQuestion?: string | null
  witnessTrail: string[]
}

export function buildWitnessQuestion(
  input: BuildWitnessQuestionInput,
): string {
  return input.latestEntry
}