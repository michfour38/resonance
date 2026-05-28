import type { CompassAreaResponse } from "./session-types"

export type CompassAreaMirrorReflection = {
  reflection: string
  strongestAreas: string[]
}

export function buildAreaMirrorReflection(
  responses: CompassAreaResponse[],
): CompassAreaMirrorReflection {
  if (responses.length === 0) {
    return {
      strongestAreas: [],
      reflection:
        "Compass does not have enough information to reflect your pattern yet.",
    }
  }

  const scored = responses
    .map((response) => ({
      ...response,
      score:
        response.languageWeight +
        response.emotionalWeight +
        response.valueWords.length +
        response.frictionWords.length,
    }))
    .sort((a, b) => b.score - a.score)

  const strongest = scored.slice(0, 3)
  const strongestAreas = strongest.map((item) => item.area)

  return {
    strongestAreas,
    reflection: buildReflection(responses, strongest),
  }
}

function buildReflection(
  responses: CompassAreaResponse[],
  strongest: CompassAreaResponse[],
): string {
  const mostCharged = strongest[0]
  const second = strongest[1]
  const third = strongest[2]

  const repeatedValues = getRepeatedWords(
    responses.flatMap((response) => response.valueWords),
  )

  const repeatedFriction = getRepeatedWords(
    responses.flatMap((response) => response.frictionWords),
  )

  const strongestLines = strongest
    .map((response) => {
      return `In ${formatArea(response.area)}, you wrote: “${cleanReference(
        response.answer,
      )}”`
    })
    .join("\n\n")

  const valueLine =
    repeatedValues.length > 0
      ? `The repeated value-language appears to gather around: ${repeatedValues.join(
          ", ",
        )}.`
      : "The value underneath this is not fully named yet, but your answers are already circling something important."

  const frictionLine =
    repeatedFriction.length > 0
      ? `The repeated pressure-language appears to gather around: ${repeatedFriction.join(
          ", ",
        )}.`
      : "There is pressure here, but it is not presenting as one simple emotion yet."

  return `
Compass is not choosing for you.

It is reading where your own language became more alive, more pressured, or more specific.

${strongestLines}

The strongest pull appears to be around ${formatArea(mostCharged.area)}${
    second ? `, with ${formatArea(second.area)} also carrying weight` : ""
  }${third ? `, and ${formatArea(third.area)} close behind` : ""}.

${valueLine}

${frictionLine}

This may not mean “choose the area that hurts most.”

It may mean:
- this is where your energy is currently leaking,
- this is where a deeper value is asking for structure,
- or this is the area supporting several of the others beneath the surface.

Before choosing, notice the difference between urgency and truth.

Which area feels like it would change the most if you stopped negotiating with yourself?
`.trim()
}

function getRepeatedWords(words: string[]): string[] {
  const counts = new Map<string, number>()

  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1)
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 5)
}

function formatArea(area: string): string {
  return area.charAt(0).toUpperCase() + area.slice(1)
}

function cleanReference(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ")

  if (trimmed.length <= 160) {
    return trimmed
  }

  return `${trimmed.slice(0, 160)}...`
}