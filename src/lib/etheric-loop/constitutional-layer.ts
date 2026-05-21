export type ELBoundaryDecision = {
  allowDepth: boolean
  reduceIntensity: boolean
  reduceQuestionLoad: boolean
  shouldSlowPacing: boolean
  avoidChallenge: boolean
  reasoning: string[]
}

export function evaluateConstitutionalBoundaries({
  detectedState,
  recentStates,
  answerLength,
}: {
  detectedState: string
  recentStates: string[]
  answerLength: number
}): ELBoundaryDecision {
  const reasoning: string[] = []

  let allowDepth = true
  let reduceIntensity = false
  let reduceQuestionLoad = false
  let shouldSlowPacing = false
  let avoidChallenge = false

  const overwhelmed =
    detectedState === "overwhelm"

  const collapsed =
    detectedState === "collapse"

  const frozen =
    detectedState === "freeze"

  const shame =
    detectedState === "shame"

  if (
    overwhelmed ||
    collapsed ||
    frozen
  ) {
    reduceIntensity = true
    reduceQuestionLoad = true
    shouldSlowPacing = true

    reasoning.push(
      "System reducing pressure due to overwhelm/freeze/collapse state.",
    )
  }

  if (shame) {
    avoidChallenge = true

    reasoning.push(
      "Challenge reduced due to active shame indicators.",
    )
  }

  const repeatedCollapse =
    recentStates.filter(
      (state) =>
        state === "collapse" ||
        state === "freeze",
    ).length >= 2

  if (repeatedCollapse) {
    allowDepth = false
    reduceIntensity = true
    shouldSlowPacing = true

    reasoning.push(
      "Repeated collapse states detected. Depth restricted temporarily.",
    )
  }

  if (answerLength < 12) {
    reduceQuestionLoad = true

    reasoning.push(
      "Short response detected. Cognitive load reduced.",
    )
  }

  return {
    allowDepth,
    reduceIntensity,
    reduceQuestionLoad,
    shouldSlowPacing,
    avoidChallenge,
    reasoning,
  }
}