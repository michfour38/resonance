export const ACCOUNTABILITY_LADDER = {
  observation: "What happened that can be observed?",
  meaning: "What meaning did you attach to what happened?",
  effect: "What effect did it have on you?",
  response: "What did you do in response?",
  ownership: "What part of your response belongs to you?",
  assumption:
    "What are you assuming about the other person that you cannot know?",
  acknowledgement: "What needs to be acknowledged?",
  boundary: "What boundary or request is now necessary?",
  willingness: "What are you willing to do differently?",
} as const

export type AccountabilityRung =
  keyof typeof ACCOUNTABILITY_LADDER

export type ShareRiskType =
  | "threat"
  | "coercion"
  | "degradation"
  | "character_condemnation"
  | "diagnosis_as_weapon"
  | "mind_reading"
  | "globalising"
  | "audience_recruitment"

export type ProtectedTruth = {
  observableEvent: boolean
  painOrImpact: boolean
  accountabilityRequest: boolean
  evidencedPattern: boolean
  boundaryOrConsequence: boolean
  strongLanguagePresent: boolean
}

export type ShareReviewResult = {
  requiresReview: boolean
  riskLevel: number
  riskType: ShareRiskType | null
  reason: string | null
  matchedExcerpt: string | null
  recommendedRung: AccountabilityRung | null
  nextQuestion: string | null
  protectedTruth: ProtectedTruth
}

type ShareReviewRule = {
  riskType: ShareRiskType
  riskLevel: number
  recommendedRung: AccountabilityRung
  reason: string
  patterns: RegExp[]
}

const SHARE_REVIEW_RULES: ShareReviewRule[] = [
  {
    riskType: "coercion",
    riskLevel: 90,
    recommendedRung: "boundary",
    reason:
      "The message attempts to force a response through punishment or fear. A boundary may state what you will do, but it cannot remove the other person's choice.",
    patterns: [
      /\bif you (?:do not|don't|will not|won't).{0,80}\b(?:i(?:'ll| will)\s+(?:punish|expose|humiliate|ruin|destroy)|you(?:'ll| will)\s+(?:pay|regret|suffer))\b/i,
      /\byou (?:have to|must) (?:agree|admit|forgive|apologise|apologize|answer|respond) or\b/i,
    ],
  },
  {
    riskType: "threat",
    riskLevel: 100,
    recommendedRung: "willingness",
    reason:
      "The message moves from describing harm into threatening harm. The anger may remain, but the other person cannot be required to receive a threat.",
    patterns: [
      /\b(?:i(?:'ll| will)|we(?:'ll| will))\s+(?:hurt|kill|destroy|ruin|expose|punish)\s+you\b/i,
      /\byou(?:'ll| will)\s+(?:pay|regret this|be sorry)\b/i,
      /\bi(?:'ll| will)\s+make you pay\b/i,
    ],
  },
  {
    riskType: "degradation",
    riskLevel: 80,
    recommendedRung: "observation",
    reason:
      "The message moves from describing behaviour or personal impact into using disgust or contempt as a verdict about the other person. The experience may remain, but the attack on personhood cannot be sent.",
    patterns: [
      /\byou(?:'re| are| were)\s+(?:pathetic|worthless|disgusting|vile|filthy|stupid|useless|evil)\b/i,
      /\byou(?:'re| are| were)\s+(?:a|an)\s+(?:disgusting\s+)?(?:monster|idiot|failure|joke)\b/i,
      /\byou(?:'re| are| were)\s+(?:trash|garbage|nothing)\b/i,
      /\byou make me sick(?: to my stomach)?\b/i,
      /\byou disgust me\b/i,
      /\bi(?:'m| am) disgusted by you\b/i,
    ],
  },
  {
    riskType: "diagnosis_as_weapon",
    riskLevel: 75,
    recommendedRung: "observation",
    reason:
      "The message uses a diagnosis or psychological label as a verdict. Describe the conduct that became visible rather than using a label to condemn the person.",
    patterns: [
      /\byou(?:'re| are)\s+(?:a |an )?(?:narcissist|psychopath|sociopath)\b/i,
      /\byou(?:'re| are)\s+(?:crazy|insane|bipolar)\b/i,
    ],
  },
  {
    riskType: "character_condemnation",
    riskLevel: 70,
    recommendedRung: "observation",
    reason:
      "The message turns behaviour into a total judgement about who the other person is. Name the conduct or pattern without making the whole person the conclusion.",
    patterns: [
      /\bthis is (?:just )?who you are\b/i,
      /\byou(?:'re| are)\s+(?:nothing but|incapable of being|the kind of person who)\b/i,
      /\byou have always been this way\b/i,
    ],
  },
  {
    riskType: "audience_recruitment",
    riskLevel: 60,
    recommendedRung: "acknowledgement",
    reason:
      "The message recruits other people's presumed agreement as evidence against the recipient. Name what you need acknowledged without constructing an audience against them.",
    patterns: [
      /\beveryone (?:knows|agrees|can see|thinks)\b/i,
      /\bpeople (?:know|agree|can see|think) (?:what|that) you\b/i,
      /\bno one believes you\b/i,
    ],
  },
  {
    riskType: "mind_reading",
    riskLevel: 55,
    recommendedRung: "assumption",
    reason:
      "The message claims certainty about an intention that cannot be directly observed. The behaviour and its effect may remain, but the assumed motive must be separated from what is known.",
    patterns: [
      /\byou (?:wanted|meant|intended|planned|chose) to (?:hurt|humiliate|punish|control|destroy|embarrass|frighten|degrade) me\b/i,
      /\byou (?:do not|don't|never) care(?:d)? about me\b/i,
      /\byou only did (?:that|it) because\b/i,
    ],
  },
  {
    riskType: "globalising",
    riskLevel: 45,
    recommendedRung: "observation",
    reason:
      "The message turns a pattern into a total statement about the other person. Name the observable pattern and the examples supporting it.",
    patterns: [
      /\byou always (?:do this|ruin everything|make everything about you|hurt people)\b/i,
      /\byou never (?:change|listen|care|take responsibility|tell the truth)\b/i,
      /\beverything is always about you\b/i,
    ],
  },
]

const REPORTED_SPEECH_LEAD_IN =
  /(?:\bwhen\s+)?(?:you\s+(?:said|told\s+me|wrote|texted|messaged|replied|admitted|stated|threatened|shouted|yelled)|i\s+(?:heard|was\s+told)\s+you\s+(?:say|said))\s*(?:(?:that\s+)|[:,\-–—]\s*|["“”‘’']\s*)*$/i

function detectProtectedTruth(
  content: string,
): ProtectedTruth {
  return {
    observableEvent:
      /\bwhen you\b|\byou (?:said|did|left|arrived|called|sent|told|asked|refused|stopped|continued|paid|did not|didn't)\b/i.test(
        content,
      ),

    painOrImpact:
      /\bi (?:felt|feel|was hurt|was frightened|was afraid|was affected|experienced|could not|couldn't|cannot|lost|needed)\b/i.test(
        content,
      ),

    accountabilityRequest:
      /\b(?:i need you to acknowledge|i am asking you to|please acknowledge|take responsibility|accountability)\b/i.test(
        content,
      ),

    evidencedPattern:
      /\b(?:again|repeatedly|more than once|each time|the last \d+ times|this happened before|the same thing happened)\b/i.test(
        content,
      ),

    boundaryOrConsequence:
      /\b(?:i will not|i am not willing|i cannot continue|my boundary is|i need|i will leave|i will step back|i will pause|i will end)\b/i.test(
        content,
      ),

    strongLanguagePresent:
      /\b(?:fuck|fucking|shit|damn|bullshit)\b/i.test(
        content,
      ),
  }
}

function isReportedSpeech(
  content: string,
  matchIndex: number,
): boolean {
  const precedingContext = content.slice(
    Math.max(0, matchIndex - 160),
    matchIndex,
  )

  return REPORTED_SPEECH_LEAD_IN.test(
    precedingContext,
  )
}

function findMatchedExcerpt(
  content: string,
  patterns: RegExp[],
): string | null {
  for (const pattern of patterns) {
    const flags = pattern.flags.includes("g")
      ? pattern.flags
      : `${pattern.flags}g`

    const matcher = new RegExp(
      pattern.source,
      flags,
    )

    let match = matcher.exec(content)

    while (match) {
      if (
        typeof match.index === "number" &&
        !isReportedSpeech(content, match.index)
      ) {
        return match[0].trim()
      }

      match = matcher.exec(content)
    }
  }

  return null
}

export function reviewSharedMessage(
  content: string,
): ShareReviewResult {
  const text = content.trim()
  const protectedTruth = detectProtectedTruth(text)

  if (!text) {
    return {
      requiresReview: false,
      riskLevel: 0,
      riskType: null,
      reason: null,
      matchedExcerpt: null,
      recommendedRung: null,
      nextQuestion: null,
      protectedTruth,
    }
  }

  for (const rule of SHARE_REVIEW_RULES) {
    const matchedExcerpt = findMatchedExcerpt(
      text,
      rule.patterns,
    )

    if (!matchedExcerpt) {
      continue
    }

    return {
      requiresReview: true,
      riskLevel: rule.riskLevel,
      riskType: rule.riskType,
      reason: rule.reason,
      matchedExcerpt,
      recommendedRung: rule.recommendedRung,
      nextQuestion:
        ACCOUNTABILITY_LADDER[
          rule.recommendedRung
        ],
      protectedTruth,
    }
  }

  return {
    requiresReview: false,
    riskLevel: 0,
    riskType: null,
    reason: null,
    matchedExcerpt: null,
    recommendedRung: null,
    nextQuestion: null,
    protectedTruth,
  }
}