export function detectPauseReadiness(content: string) {
  const text = content.toLowerCase()

  let score = 0

  if (
    text.includes("i notice") ||
    text.includes("i realize") ||
    text.includes("i understand")
  ) {
    score += 1
  }

  if (
    text.includes("my part") ||
    text.includes("i contributed") ||
    text.includes("i could have")
  ) {
    score += 1
  }

  if (
    text.includes("next time") ||
    text.includes("differently") ||
    text.includes("possible")
  ) {
    score += 1
  }

  return {
    score,
    appearsReflective: score >= 2,
  }
}