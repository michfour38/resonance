export type PatternSignal = {
  type:
    | "accusation"
    | "contempt"
    | "absolute_language"
    | "ownership"
    | "possibility"
    | "repair"
    | "mimicry"
  confidence: number
}

export function detectPatternSignals(
  content: string,
): PatternSignal[] {
  const text = content.toLowerCase()

  const signals: PatternSignal[] = []

  if (
    text.includes("you always") ||
    text.includes("you never") ||
    text.includes("you only")
  ) {
    signals.push({
      type: "absolute_language",
      confidence: 70,
    })
  }

  if (
    text.includes("idiot") ||
    text.includes("stupid") ||
    text.includes("pathetic") ||
    text.includes("worthless")
  ) {
    signals.push({
      type: "contempt",
      confidence: 90,
    })
  }

  if (
    text.includes("i notice") ||
    text.includes("i realize") ||
    text.includes("i see that")
  ) {
    signals.push({
      type: "ownership",
      confidence: 60,
    })
  }

  if (
    text.includes("possible") ||
    text.includes("could") ||
    text.includes("5%")
  ) {
    signals.push({
      type: "possibility",
      confidence: 60,
    })
  }

if (
  text.includes("i understand") ||
  text.includes("i hear you") ||
  text.includes("i take responsibility") ||
  text.includes("i will do better")
) {
  signals.push({
    type: "mimicry",
    confidence: 50,
  })
}

  return signals
}