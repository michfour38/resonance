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
    "Why is this important to you right now?",
    "What would change if this became consistent?",
    "What would this allow you to feel, experience, or become?",
    "What feels restricted, unresolved, or incomplete without this?",
    "What deeper value might be underneath this?",
    "If this became real, what would finally feel possible?",
    "What is the deepest reason this still matters to you?",
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
    return `Why is ${selectedAreaLabel.toLowerCase()} important to you right now?`
  }

  if (layer === 1) {
    return `Why is “${reference}” important to you right now?`
  }

  if (layer === 2) {
    return `You wrote: “${reference}” — why does that matter to you?`
  }

  if (layer === 3) {
    return `What would it mean if “${reference}” became more consistent in your life?`
  }

  if (layer === 4) {
    return `What feels restricted, unresolved, or incomplete without “${reference}”?`
  }

  if (layer === 5) {
    return `What deeper value might sit underneath “${reference}”?`
  }

  if (layer === 6) {
    return `If “${reference}” became real, what would finally feel possible?`
  }

  return `What is the deepest reason “${reference}” still matters to you?`
}

function cleanReference(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ")

  if (trimmed.length <= 140) {
    return trimmed
  }

  return `${trimmed.slice(0, 140)}...`
}

function extractReasonWords(input: string): string[] {
  const words = input
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean)

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
      words.filter(
        (word) => word.length > 4 && !ignored.includes(word),
      ),
    ),
  ]
}