type PrivateWitnessEntry = {
  content: string
  prompt_text?: string | null
}

export type WitnessInvestigation = {
  tension: string
  evidence: string[]
  confidence: number
}

type InvestigationRule = {
  tension: string
  signals: string[]
  minimumSignals: number
  evidence: string
  confidence: number
}

const INVESTIGATION_RULES: InvestigationRule[] = [
  {
    tension:
      "Physical reconnection may be being treated as relational repair.",
    signals: [
      "sex",
      "fuck",
      "vagina",
      "forgiveness",
      "all is well",
      "all was well",
      "physical",
      "intimacy",
      "repair",
    ],
    minimumSignals: 2,
    evidence:
      "Physical intimacy, forgiveness, or repair language appeared together.",
    confidence: 0.88,
  },
  {
    tension:
      "Withdrawal may be ending the conflict without resolving what caused it.",
    signals: [
      "silent treatment",
      "ignored",
      "ignoring",
      "leaving",
      "walk out",
      "walking out",
      "casino",
      "until i comply",
      "do nothing",
    ],
    minimumSignals: 2,
    evidence:
      "Withdrawal, silence, leaving, or compliance appeared as part of the conflict pattern.",
    confidence: 0.86,
  },
  {
    tension:
      "Emotional truth may be going elsewhere instead of returning to the relationship.",
    signals: [
      "other woman",
      "other women",
      "pouring his heart",
      "speaking his heart",
      "cry",
      "shoulder",
      "dump",
      "purge",
      "women",
    ],
    minimumSignals: 2,
    evidence:
      "Emotional disclosure elsewhere appeared as part of the relationship pattern.",
    confidence: 0.86,
  },
  {
    tension:
      "Safety may depend on distance because face-to-face contact escalates too quickly.",
    signals: [
      "message",
      "text",
      "face to face",
      "not in my face",
      "less heated",
      "calmer",
      "softer",
      "escalating",
      "regulate",
    ],
    minimumSignals: 2,
    evidence:
      "Distance, messaging, softness, heat, or regulation appeared together.",
    confidence: 0.82,
  },
  {
    tension:
      "Truth and performance may be splitting into two different realities.",
    signals: [
      "lied",
      "lying",
      "truth",
      "reality",
      "farce",
      "everything was great",
      "put me on display",
      "weaponized",
      "ripped me to shreds",
    ],
    minimumSignals: 2,
    evidence:
      "Truth, lying, performance, exposure, or image-management appeared together.",
    confidence: 0.9,
  },
]

function clean(text: string) {
  return text.replace(/\s+/g, " ").trim()
}

function includesSignal(text: string, signal: string) {
  return text.toLowerCase().includes(signal.toLowerCase())
}

function collectEvidence(entries: PrivateWitnessEntry[], rule: InvestigationRule) {
  return entries
    .map((entry) => clean(entry.content))
    .filter(Boolean)
    .filter((content) =>
      rule.signals.some((signal) => includesSignal(content, signal)),
    )
}

export function extractWitnessInvestigations(
  entries: PrivateWitnessEntry[],
): WitnessInvestigation[] {
  return INVESTIGATION_RULES.map((rule) => {
    const evidence = collectEvidence(entries, rule)
    const matchedSignals = new Set<string>()

    evidence.forEach((entry) => {
      rule.signals.forEach((signal) => {
        if (includesSignal(entry, signal)) {
          matchedSignals.add(signal)
        }
      })
    })

    if (matchedSignals.size < rule.minimumSignals) {
      return null
    }

    return {
      tension: rule.tension,
      evidence: [rule.evidence, ...evidence],
      confidence: Math.min(
        0.96,
        rule.confidence + matchedSignals.size * 0.015,
      ),
    }
  }).filter(
    (investigation): investigation is WitnessInvestigation =>
      Boolean(investigation),
  )
}

export function getStrongestWitnessInvestigation(
  entries: PrivateWitnessEntry[],
): WitnessInvestigation | null {
  const investigations = extractWitnessInvestigations(entries)

  if (investigations.length === 0) return null

  return [...investigations].sort((a, b) => b.confidence - a.confidence)[0]
}