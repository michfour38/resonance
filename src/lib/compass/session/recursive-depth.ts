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
  "choice",
  "independence",
  "capacity",
  "protection",
  "provision",
]

export function getRecursiveQuestion(layer: number): string {
  const questions = [
    "Why does this matter to you right now?",
    "What feels painful, frustrating, unfair, unresolved, or heavy inside this?",
    "What fear, pressure, belief, or old pattern might be sitting underneath this?",
    "If this no longer held the same emotional weight, what would change in your daily life, decisions, body, or relationships?",
    "What would you be able to choose, build, protect, or become if that pressure began to shift?",
    "What does this show you about what you deeply need, value, or refuse to keep living without?",
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
  const area = selectedAreaLabel.toLowerCase()

  if (!reference) {
    return `Why does ${area} matter to you right now?`
  }

  if (layer === 1) {
    return `You chose ${area}. In your own words, why does “${reference}” matter to you right now?`
  }

  if (layer === 2) {
    return `When you describe “${reference}”, what feels painful, frustrating, unfair, unresolved, or emotionally heavy inside it?`
  }

  if (layer === 3) {
    return `Under “${reference}”, what fear, pressure, belief, or old pattern might be quietly driving the weight of this goal?`
  }

  if (layer === 4) {
    return `If “${reference}” no longer carried the same emotional weight, what would change in your daily life, decisions, body, relationships, or sense of self?`
  }

  if (layer === 5) {
    return `If the pressure inside “${reference}” began to shift, what would you be able to choose, build, protect, or become that feels difficult right now?`
  }

  if (layer === 6) {
    return `Looking at “${reference}”, what does this reveal about what you deeply need, value, or refuse to keep living without?`
  }

  return `After everything you have written, what is the truest reason “${reference}” still matters to you?`
}

function cleanReference(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ")

  if (trimmed.length <= 110) {
    return trimmed
  }

  return `${trimmed.slice(0, 110)}...`
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
    "what",
    "when",
    "where",
    "which",
  ]

  return [
    ...new Set(
      words.filter((word) => word.length > 4 && !ignored.includes(word)),
    ),
  ]
}