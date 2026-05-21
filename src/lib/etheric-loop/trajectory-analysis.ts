import {
  detectEthericLoopState,
  type EthericLoopState,
} from "./state-detection"

export type TrajectoryAnalysis = {
  dominantState: EthericLoopState
  recurringStates: EthericLoopState[]
  movementTrend:
    | "improving"
    | "stagnant"
    | "regressing"
    | "activating"

  observations: string[]
}

export function analyzeTrajectory(
  answers: string[],
): TrajectoryAnalysis {
  const detectedStates = answers.map((answer) =>
    detectEthericLoopState(answer).primaryState,
  )

  const frequencyMap = new Map<
    EthericLoopState,
    number
  >()

  for (const state of detectedStates) {
    frequencyMap.set(
      state,
      (frequencyMap.get(state) ?? 0) + 1,
    )
  }

  const dominantState =
    [...frequencyMap.entries()].sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0] ?? "unclear"

  const recurringStates = [...frequencyMap.entries()]
    .filter(([, count]) => count >= 2)
    .map(([state]) => state)

  const observations: string[] = []

  if (recurringStates.includes("overwhelm")) {
    observations.push(
      "Overwhelm appears repeatedly across responses.",
    )
  }

  if (recurringStates.includes("avoidance")) {
    observations.push(
      "Avoidance patterns are recurring rather than isolated.",
    )
  }

  if (recurringStates.includes("self_trust_gap")) {
    observations.push(
      "Self-trust appears unstable across multiple moments.",
    )
  }

  const lastState =
    detectedStates[detectedStates.length - 1]

  const previousState =
    detectedStates[detectedStates.length - 2]

  let movementTrend:
    | "improving"
    | "stagnant"
    | "regressing"
    | "activating" = "stagnant"

  if (
    previousState !== "ready" &&
    lastState === "ready"
  ) {
    movementTrend = "activating"

    observations.push(
      "Movement readiness increased in the latest response.",
    )
  }

  if (
    lastState === previousState &&
    recurringStates.length >= 2
  ) {
    movementTrend = "stagnant"

    observations.push(
      "The same emotional state is repeating without visible movement.",
    )
  }

  if (
    lastState === "collapse" ||
    lastState === "freeze"
  ) {
    movementTrend = "regressing"

    observations.push(
      "Recent responses suggest shutdown or regression.",
    )
  }

  return {
    dominantState,
    recurringStates,
    movementTrend,
    observations,
  }
}