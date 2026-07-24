import type {
  Evidence,
  EvidenceType,
} from "./el-types"

const REALITY_PATTERNS = [
  /\$?\d+[kKmM]?\+?/,
  /\b\d+\b/,
  /\bmonthly\b/i,
  /\bweekly\b/i,
  /\bdaily\b/i,
  /\bafter tax\b/i,
  /\bUSD\b/i,
  /\bR\d+/i,
]

const RESOURCE_WORDS = [
  "time",
  "money",
  "income",
  "energy",
  "support",
  "confidence",
  "clarity",
  "focus",
  "network",
  "creator",
  "creators",
  "access",
  "knowledge",
  "skill",
  "skills",
]

const STRENGTH_WORDS = [
  "i know",
  "i learned",
  "i learnt",
  "i understand",
  "i noticed",
  "i recognise",
  "i recognize",
  "i figured out",
  "i worked out",
  "i managed",
  "i built",
  "i created",
  "i handled",
  "i already",
]

const POSSIBILITY_WORDS = [
  "could",
  "might",
  "possible",
  "possibility",
  "option",
  "path",
  "idea",
  "opportunity",
]

const CHOICE_WORDS = [
  "choose",
  "chosen",
  "decide",
  "decision",
  "first",
  "priority",
  "commit",
  "committed",
]

const OBJECTION_WORDS = [
  "but",
  "can't",
  "cannot",
  "don't know",
  "dont know",
  "impossible",
  "worried",
  "afraid",
  "stuck",
  "unsure",
  "not sure",
  "won't",
  "wont",
]

const MOVEMENT_WORDS = [
  "sent",
  "booked",
  "called",
  "created",
  "published",
  "launched",
  "messaged",
  "contacted",
  "completed",
  "paid",
  "cancelled",
  "opened",
  "wrote",
]

export function extractEvidence(
  response: string,
): Evidence[] {
  const timestamp = new Date().toISOString()
  const evidence: Evidence[] = []
  const normalized = response.toLowerCase()

  for (const pattern of REALITY_PATTERNS) {
    const match = response.match(pattern)

    if (match?.[0]) {
      evidence.push(
        createEvidence({
          type: "reality",
          content: match[0],
          confidence: 0.75,
          timestamp,
        }),
      )
    }
  }

addWordEvidence({
  evidence,
  normalized,
  response,
  words: RESOURCE_WORDS,
  type: "resource",
  timestamp,
})

addWordEvidence({
  evidence,
  normalized,
  response,
  words: STRENGTH_WORDS,
  type: "strength",
  timestamp,
})

addWordEvidence({
  evidence,
  normalized,
  response,
  words: POSSIBILITY_WORDS,
  type: "possibility",
  timestamp,
})

addWordEvidence({
  evidence,
  normalized,
  response,
  words: CHOICE_WORDS,
  type: "choice",
  timestamp,
})

addWordEvidence({
  evidence,
  normalized,
  response,
  words: OBJECTION_WORDS,
  type: "objection",
  timestamp,
})

addWordEvidence({
  evidence,
  normalized,
  response,
  words: MOVEMENT_WORDS,
  type: "movement",
  timestamp,
})

  return dedupeEvidence(evidence)
}

function addWordEvidence({
  evidence,
  normalized,
  response,
  words,
  type,
  timestamp,
}: {
  evidence: Evidence[]
  normalized: string
  response: string
  words: string[]
  type: EvidenceType
  timestamp: string
}) {
  for (const word of words) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const pattern = new RegExp(`\\b${escaped}\\b`, "i")

if (pattern.test(normalized)) {
      evidence.push(
        createEvidence({
          type,
          content: extractContextPhrase(response, word),
          confidence: 0.65,
          timestamp,
        }),
      )
    }
  }
}

function createEvidence({
  type,
  content,
  confidence,
  timestamp,
}: {
  type: EvidenceType
  content: string
  confidence: number
  timestamp: string
}): Evidence {
  return {
    id: crypto.randomUUID(),
    type,
    content,
    confidence,
    source: "participant",
    timestamp,
  }
}

function dedupeEvidence(
  evidence: Evidence[],
): Evidence[] {
  const seen = new Set<string>()

  return evidence.filter((item) => {
    const key = `${item.type}:${item.content.toLowerCase()}`

    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}

function extractContextPhrase(
  response: string,
  word: string,
): string {
  const sentences = response
    .trim()
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  const normalizedWord = word.toLowerCase()

  const sentence = sentences.find((item) =>
    item.toLowerCase().includes(normalizedWord),
  )

  return sentence ?? word
}