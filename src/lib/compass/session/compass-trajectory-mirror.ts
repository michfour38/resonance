import type {
  CompassAreaResponse,
  CompassGoalArea,
  CompassRecursiveLayer,
} from "./session-types"

const AREA_LABELS: Record<CompassGoalArea, string> = {
  relationships: "Relationships",
  income: "Income",
  health: "Health",
  spirituality: "Spirituality",
  investments: "Investments",
  network: "Network",
  knowledge: "Knowledge",
  lifestyle: "Lifestyle",
}

export function buildCompassTrajectoryMirror({
  areaResponses,
  selectedArea,
  recursiveLayers,
}: {
  areaResponses: CompassAreaResponse[]
  selectedArea: CompassGoalArea | null
  recursiveLayers: CompassRecursiveLayer[]
}): string {
  const selectedAreaLabel = selectedArea
    ? AREA_LABELS[selectedArea]
    : "the area you chose"

  const selectedAreaAnswer =
    areaResponses.find((response) => response.area === selectedArea)?.answer ??
    ""

  const usableLayers = recursiveLayers.filter((layer) => layer.answer.trim())
  const openingLayers = usableLayers.slice(0, 2)
  const middleLayers = usableLayers.slice(2, 5)
  const deepestLayers = usableLayers.slice(-3)

  const openingText = cleanJoin([
    selectedAreaAnswer,
    ...openingLayers.map((layer) => layer.answer),
  ])

  const middleText = cleanJoin(middleLayers.map((layer) => layer.answer))

  const deepestText = cleanJoin(deepestLayers.map((layer) => layer.answer))

  return `
A deeper reality is beginning to take shape.

You began with ${selectedAreaLabel.toLowerCase()}.

At first, the focus appeared to be:

“${cleanReference(openingText)}”

As you moved deeper, the focus began to shift:

“${cleanReference(middleText)}”

By the final layers, the strongest thread was no longer only the original goal:

“${cleanReference(deepestText)}”

This is the point of The Descent.

The original goal is not dismissed.

It becomes the doorway.

What matters now is the trajectory your answers revealed.

As more of this reality becomes available in your life, what becomes possible that is difficult, restricted, or unavailable today?
`.trim()
}

function cleanJoin(values: string[]): string {
  return values
    .filter(Boolean)
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ")
}

function cleanReference(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ")

  if (trimmed.length <= 260) {
    return trimmed
  }

  return `${trimmed.slice(0, 260)}...`
}