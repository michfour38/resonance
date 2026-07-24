import type {
  Evidence,
  Observation,
  ObservationType,
} from "./el-types"

export function createObservations(
  evidence: Evidence[],
): Observation[] {
  const observations: Observation[] = []

  observations.push(
    ...createGroupedObservation(
      evidence,
      "reality",
      "Reality signals detected.",
    ),
  )

  observations.push(
    ...createGroupedObservation(
      evidence,
      "resource",
      "Resource signals detected.",
    ),
  )

observations.push(
  ...createGroupedObservation(
    evidence,
    "strength",
    "Strength signals detected.",
  ),
)

  observations.push(
    ...createGroupedObservation(
      evidence,
      "possibility",
      "Possibility signals detected.",
    ),
  )

  observations.push(
    ...createGroupedObservation(
      evidence,
      "choice",
      "Choice signals detected.",
    ),
  )

  observations.push(
    ...createGroupedObservation(
      evidence,
      "objection",
      "Objection signals detected.",
    ),
  )

  observations.push(
    ...createGroupedObservation(
      evidence,
      "movement",
      "Movement signals detected.",
    ),
  )

  const contradiction = detectContradiction(
    evidence,
  )

  if (contradiction) {
    observations.push(contradiction)
  }

  const activation = detectActivation(
    evidence,
  )

  if (activation) {
    observations.push(activation)
  }

  return observations
}

function createGroupedObservation(
  evidence: Evidence[],
  type: ObservationType,
  summary: string,
): Observation[] {
  const matching = evidence.filter(
    (item) => item.type === type,
  )

  if (matching.length === 0) {
    return []
  }

  return [
  {
    id: crypto.randomUUID(),
    type,
    confidence:
      matching.reduce(
        (sum, item) => sum + item.confidence,
        0,
      ) / matching.length,
    evidenceIds: matching.map(
      (item) => item.id,
    ),
    summary: `${summary} ${matching
      .map((item) => item.content)
      .join(" | ")}`,
  },
]
}

function detectContradiction(
  _evidence: Evidence[],
): Observation | null {
  return null
}

function detectActivation(
  evidence: Evidence[],
): Observation | null {
  const activationEvidence = evidence.filter(
    (item) =>
      item.type === "possibility" ||
      item.type === "choice" ||
      item.type === "movement",
  )

  if (activationEvidence.length === 0) {
    return null
  }

  return {
    id: crypto.randomUUID(),
    type: "activation",
    confidence: Math.min(
      1,
      activationEvidence.length / 5,
    ),
    evidenceIds: activationEvidence.map(
      (item) => item.id,
    ),
    summary: "Activation signals detected.",
  }
}