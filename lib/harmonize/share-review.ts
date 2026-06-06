export type ShareReviewResult = {
  requiresReview: boolean
  riskLevel: number
  riskType: string | null
  reason: string | null
}

const contemptSignals = [
  "idiot",
  "stupid",
  "pathetic",
  "useless",
  "crazy",
  "worthless",
  "shut up",
]

const absoluteSignals = [
  "you always",
  "you never",
  "you only",
]

const privateDataSignals = [
  "password",
  "address",
  "school",
  "medical",
  "diagnosis",
  "birth certificate",
  "id number",
  "passport",
]

export function reviewSharedMessage(content: string): ShareReviewResult {
  const normalized = content.toLowerCase()

  const contempt = contemptSignals.find((signal) =>
    normalized.includes(signal),
  )

  if (contempt) {
    return {
      requiresReview: true,
      riskLevel: 90,
      riskType: "contempt",
      reason:
        "This message may contain contempt, ridicule, humiliation, or language likely to make the other person feel small.",
    }
  }

  const privateData = privateDataSignals.find((signal) =>
    normalized.includes(signal),
  )

  if (privateData) {
    return {
      requiresReview: true,
      riskLevel: 80,
      riskType: "personal_data",
      reason:
        "This message may contain personal or private information that may be difficult to retract once shared.",
    }
  }

  const absolute = absoluteSignals.find((signal) =>
    normalized.includes(signal),
  )

  if (absolute) {
    return {
      requiresReview: true,
      riskLevel: 60,
      riskType: "absolute_language",
      reason:
        "This message may contain absolute language. Shared repair works best when pain is expressed without turning the other person into a fixed conclusion.",
    }
  }

  return {
    requiresReview: false,
    riskLevel: 0,
    riskType: null,
    reason: null,
  }
}