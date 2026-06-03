import type {
  CompassAreaResponse,
  CompassGoalArea,
  CompassRecursiveLayer,
} from "./session-types"

import { buildCompassTrajectoryMirror } from "./compass-trajectory-mirror"

export type CoreValueReflection = {
  detectedValues: string[]
  primaryValue: string | null
  reflection: string
}

const CORE_REALITY_WORDS = [
  "freedom",
  "possibility",
  "possible",
  "choice",
  "agency",
  "independence",
  "self-reliance",
  "responsibility",
  "stability",
  "security",
  "support",
  "confidence",
  "clarity",
  "movement",
  "provision",
  "capacity",
  "sovereignty",
]

export function reflectCoreValues({
  areaResponses,
  selectedArea,
  layers,
}: {
  areaResponses: CompassAreaResponse[]
  selectedArea: CompassGoalArea | null
  layers: CompassRecursiveLayer[]
}): CoreValueReflection {
  const valueCounts = new Map<string, number>()

  for (const layer of layers) {
    for (const value of layer.detectedValueWords) {
      valueCounts.set(value, (valueCounts.get(value) ?? 0) + 1)
    }
  }

  const sortedValues = [...valueCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value)

  const primaryValue = sortedValues[0] ?? null

  return {
    detectedValues: sortedValues,
    primaryValue,
    reflection: buildCompassTrajectoryMirror({
  areaResponses,
  selectedArea,
  recursiveLayers: layers,
}),
  }
}

function buildCoreRealityReflection(
  layers: CompassRecursiveLayer[],
  values: string[],
  primaryValue: string | null,
): string {
  const usableLayers = layers.filter((layer) => layer.answer.trim())

  if (usableLayers.length === 0) {
    return `
There is not enough here yet to reflect a useful core reality.

Compass needs your own words before it should say anything back.
`.trim()
  }

  const deepestLayers = usableLayers.slice(-3)

  const strongestLines = deepestLayers
    .map(
      (layer) =>
        `Layer ${layer.layer}: “${cleanReference(layer.answer)}”`,
    )
    .join("\n\n")

  const combinedDeepText = deepestLayers
    .map((layer) => layer.answer)
    .join(" ")
    .toLowerCase()

  const coreMatches = uniqueMatches(
    combinedDeepText,
    CORE_REALITY_WORDS,
  )

  const realityLine =
  "Something consistent appears throughout your most recent answers."

  return `
A core reality is beginning to take shape.

Look at what you wrote most recently:

${strongestLines}

${realityLine}

Goals often point toward something deeper than the goal itself.

The question is not only what you want.

The question is what reality you are trying to build through it.

As more of this reality becomes available in your life, what becomes possible that is difficult, restricted, or unavailable today?
`.trim()
}

function uniqueMatches(
  text: string,
  words: string[],
): string[] {
  return words.filter((word, index) => {
    const appears = text.includes(word)
    const firstIndex = words.indexOf(word) === index

    return appears && firstIndex
  })
}

function cleanReference(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ")

  if (trimmed.length <= 180) {
    return trimmed
  }

  return `${trimmed.slice(0, 180)}...`
}