import type { CompassAreaResponse } from "./session-types"

export type CompassAreaMirrorReflection = {
  reflection: string
  strongestAreas: string[]
}

export function buildAreaMirrorReflection(
  responses: CompassAreaResponse[],
): CompassAreaMirrorReflection {
  const scored = responses
    .map((response) => ({
      area: response.area,
      answer: response.answer,
      score:
        response.languageWeight +
        response.emotionalWeight +
        response.valueWords.length +
        response.frictionWords.length,
    }))
    .sort((a, b) => b.score - a.score)

  const strongestAreas = scored.slice(0, 3).map((item) => item.area)

  return {
    strongestAreas,
    reflection: buildReflection(responses, strongestAreas),
  }
}

function buildReflection(
  responses: CompassAreaResponse[],
  strongestAreas: string[],
): string {
  const answeredAreas = responses
    .map((response) => response.area)
    .join(", ")

  if (responses.length === 0) {
    return "Compass does not have enough information to reflect your goal pattern yet."
  }

  return `
Compass has read across your eight life-area responses.

This is not a decision.
It is a reflection.

Your answers show movement across:
${answeredAreas}

The areas carrying the most language, emotional charge, or repeated signal appear to be:
${strongestAreas.map((area) => `- ${area}`).join("\n")}

This may mean one of three things:
- the area matters most right now,
- the area hurts most right now,
- or the area supports another goal you care about more deeply.

Before you choose your priority, pause and notice:

Where did you write most openly?
Where did you feel the most pressure?
Where did your language become more specific?
Where did your body react while answering?

You are still the one who chooses the goal.

Compass is only helping you see the pattern before you decide.
`.trim()
}