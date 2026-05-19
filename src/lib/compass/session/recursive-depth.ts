import type { CompassRecursiveLayer } from "./session-types"

const VALUE_WORDS = [
  "freedom",
  "peace",
  "love",
  "safety",
  "security",
  "clarity",
  "trust",
  "connection",
  "stability",
  "purpose",
  "meaning",
  "strength",
  "discipline",
  "calm",
  "worthiness",
  "belonging",
  "truth",
  "joy",
  "energy",
  "confidence",
  "sovereignty",
  "consistency",
]

export function getRecursiveQuestion(layer: number): string {
  const questions = [
    "Why does this matter to you right now?",
    "What hurts, frustrates, or feels unresolved around this?",
    "What fear, pressure, or belief seems connected to this?",
    "What would change if this no longer held the same weight over you?",
    "What would you be able to choose, build, or become if this shifted?",
    "What does this reveal about what you deeply need or value?",
    "What is the truest reason this still matters to you?",
  ]

  return questions[layer - 1] ?? questions[questions.length - 1]
}

export function createRecursiveLayer({
  layer,
  question,
  answer,
}: {
  layer: number
  question: string
  answer: string
}): CompassRecursiveLayer {
  const normalized = answer.toLowerCase()

  const detectedValueWords = VALUE_WORDS.filter((word) =>
    normalized.includes(word),
  )

  return {
    layer,
    question,
    answer,
    detectedValueWords,
    detectedReasonWords: extractReasonWords(answer),
  }
}

export function buildAdaptiveRecursiveQuestion({
  layer,
  selectedAreaLabel,
  previousAnswer,
  firstAnswer,
}: {
  layer: number
  selectedAreaLabel: string
  previousAnswer: string
  firstAnswer?: string
}): string {
  const reference = cleanReference(previousAnswer || firstAnswer || "")

  if (!reference) {
    return `Why does ${selectedAreaLabel.toLowerCase()} matter to you right now?`
  }

  if (layer === 1) {
    return `You wrote: “${reference}” — why does this matter to you right now?`
  }

  if (layer === 2) {
    return `What feels painful, frustrating, unfair, or unresolved inside “${reference}”?`
  }

  if (layer === 3) {
    return `What fear, belief, pressure, or old pattern might be sitting underneath “${reference}”?`
  }

  if (layer === 4) {
    return `If “${reference}” did not carry the same emotional weight, what would change for you?`
  }

  if (layer === 5) {
    return `What would you be able to choose, build, protect, or become if this shifted?`
  }

  if (layer === 6) {
    return `What does “${reference}” show you about what you deeply need, value, or refuse to keep living without?`
  }

  return `What is the truest reason “${reference}” still matters to you?`
}

function cleanReference(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ")

  if (trimmed.length <= 90) {
    return trimmed
  }

  return `${trimmed.slice(0, 90)}...`
}

function extractReasonWords(input: string): string[] {
  const words = input.toLowerCase().split(/\W+/).filter(Boolean)

  const ignored = [
    "the",
    "and",
    "but",
    "that",
    "with",
    "from",
    "into",
    "because",
    "would",
    "could",
    "should",
    "this",
    "there",
    "their",
    "about",
    "right",
  ]

  return [
    ...new Set(
      words.filter((word) => word.length > 4 && !ignored.includes(word)),
    ),
  ]
}