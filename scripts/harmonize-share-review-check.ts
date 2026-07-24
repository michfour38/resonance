import { strict as assert } from "node:assert"

import {
  reviewSharedMessage,
  type AccountabilityRung,
  type ShareRiskType,
} from "../lib/harmonize/share-review"

type ReviewCase = {
  name: string
  content: string
  blocked: boolean
  riskType?: ShareRiskType
  rung?: AccountabilityRung
}

const cases: ReviewCase[] = [
  /*
   * Protected truth
   */
  {
    name: "observable event and impact",
    content:
      "When you told our family that I had lied, I felt exposed and humiliated.",
    blocked: false,
  },
  {
    name: "reported threat is not treated as a threat",
    content:
      "You said you would kill me, and I was frightened.",
    blocked: false,
  },
  {
    name: "reported violence is not treated as intended violence",
    content:
      "When you said you wanted to hurt me, I left the room.",
    blocked: false,
  },
  {
    name: "quoted direct threat remains reported speech",
    content:
      'You said, "I will destroy you," and I left the house.',
    blocked: false,
  },
  {
    name: "reported condemnation remains reported speech",
    content:
      "You told me that I was worthless, and I felt humiliated.",
    blocked: false,
  },
  {
    name: "strong language remains permitted",
    content:
      "I fucking hate what happened and I am still deeply hurt by it.",
    blocked: false,
  },
  {
    name: "direct accountability request",
    content:
      "I need you to acknowledge that you shared private information without my permission.",
    blocked: false,
  },
  {
    name: "evidenced pattern",
    content:
      "This happened again after I asked you twice not to discuss it with other people.",
    blocked: false,
  },
  {
    name: "boundary",
    content:
      "I will not continue this conversation while I am being shouted at. I will step back and return tomorrow.",
    blocked: false,
  },
  {
    name: "anger without degradation",
    content:
      "I am furious that you did this after I explicitly asked you not to.",
    blocked: false,
  },
  {
    name: "refusal without coercion",
    content:
      "I am not willing to continue sharing private information with you.",
    blocked: false,
  },
  {
    name: "bodily impact is not disgust condemnation",
    content:
      "I felt sick when you shared my private words with other people.",
    blocked: false,
  },
  {
    name: "disgust directed at behaviour remains permitted",
    content:
      "I am disgusted by what you did with my voice notes.",
    blocked: false,
  },

  /*
   * Harmful relational movement
   */
  {
    name: "direct threat",
    content:
      "I will destroy you for what you have done.",
    blocked: true,
    riskType: "threat",
    rung: "willingness",
  },
  {
    name: "retaliatory threat",
    content:
      "You will pay for this.",
    blocked: true,
    riskType: "threat",
    rung: "willingness",
  },
  {
    name: "coercion through exposure",
    content:
      "If you don't apologise, I will expose you.",
    blocked: true,
    riskType: "coercion",
    rung: "boundary",
  },
  {
    name: "degradation",
    content:
      "You are a disgusting monster.",
    blocked: true,
    riskType: "degradation",
    rung: "observation",
  },
  {
    name: "disgust used to condemn the person",
    content:
      "You make me sick to my stomach.",
    blocked: true,
    riskType: "degradation",
    rung: "observation",
  },
  {
    name: "direct disgust judgement",
    content:
      "I am disgusted by you.",
    blocked: true,
    riskType: "degradation",
    rung: "observation",
  },
  {
    name: "diagnosis used as condemnation",
    content:
      "You are a narcissist.",
    blocked: true,
    riskType: "diagnosis_as_weapon",
    rung: "observation",
  },
  {
    name: "total character judgement",
    content:
      "This is just who you are.",
    blocked: true,
    riskType: "character_condemnation",
    rung: "observation",
  },
  {
    name: "audience recruitment",
    content:
      "Everyone knows what you are really like.",
    blocked: true,
    riskType: "audience_recruitment",
    rung: "acknowledgement",
  },
  {
    name: "claimed intention",
    content:
      "You wanted to humiliate me.",
    blocked: true,
    riskType: "mind_reading",
    rung: "assumption",
  },
  {
    name: "claimed absence of care",
    content:
      "You never cared about me.",
    blocked: true,
    riskType: "mind_reading",
    rung: "assumption",
  },
  {
    name:
      "reported speech does not conceal later direct condemnation",
    content:
      "You said you wanted to hurt me. You never cared about me.",
    blocked: true,
    riskType: "mind_reading",
    rung: "assumption",
  },
  {
    name: "globalising condemnation",
    content:
      "You never take responsibility.",
    blocked: true,
    riskType: "globalising",
    rung: "observation",
  },
]

function runReviewCase(
  testCase: ReviewCase,
): void {
  const result =
    reviewSharedMessage(testCase.content)

  assert.equal(
    result.requiresReview,
    testCase.blocked,
    [
      `Case: ${testCase.name}`,
      `Content: ${testCase.content}`,
      `Expected blocked: ${testCase.blocked}`,
      `Received blocked: ${result.requiresReview}`,
      `Received risk type: ${result.riskType}`,
      `Received reason: ${result.reason}`,
    ].join("\n"),
  )

  if (testCase.blocked) {
    assert.equal(
      result.riskType,
      testCase.riskType,
      `Incorrect risk type for "${testCase.name}"`,
    )

    assert.equal(
      result.recommendedRung,
      testCase.rung,
      `Incorrect accountability rung for "${testCase.name}"`,
    )

    assert.ok(
      result.reason,
      `Blocked case "${testCase.name}" requires a reason`,
    )

    assert.ok(
      result.matchedExcerpt,
      `Blocked case "${testCase.name}" requires a matched excerpt`,
    )

    assert.ok(
      result.nextQuestion,
      `Blocked case "${testCase.name}" requires a ladder question`,
    )
  } else {
    assert.equal(
      result.riskType,
      null,
      `Permitted case "${testCase.name}" unexpectedly returned a risk type`,
    )

    assert.equal(
      result.matchedExcerpt,
      null,
      `Permitted case "${testCase.name}" unexpectedly returned a matched excerpt`,
    )
  }

  console.log(`✓ ${testCase.name}`)
}

function testProtectedTruthDetection(): void {
  const result = reviewSharedMessage(
    [
      "When you told them what I had shared privately,",
      "I felt hurt and exposed.",
      "This happened again after I had already asked you not to do it.",
      "I need you to acknowledge what happened.",
      "I will not share further private information until this is addressed.",
      "I am fucking angry about it.",
    ].join(" "),
  )

  assert.equal(
    result.requiresReview,
    false,
    "The complete protected-truth example should be permitted",
  )

  assert.deepEqual(
    result.protectedTruth,
    {
      observableEvent: true,
      painOrImpact: true,
      accountabilityRequest: true,
      evidencedPattern: true,
      boundaryOrConsequence: true,
      strongLanguagePresent: true,
    },
    "Protected truth was not detected correctly",
  )

  console.log(
    "✓ protected truth remains intact",
  )
}

function testEmptySubmission(): void {
  const result = reviewSharedMessage("   ")

  assert.equal(result.requiresReview, false)
  assert.equal(result.riskLevel, 0)
  assert.equal(result.riskType, null)
  assert.equal(result.nextQuestion, null)

  console.log(
    "✓ empty content produces no false flag",
  )
}

function main(): void {
  console.log(
    "\nChecking Harmonize shared-submission assessment\n",
  )

  for (const testCase of cases) {
    runReviewCase(testCase)
  }

  testProtectedTruthDetection()
  testEmptySubmission()

  console.log(
    `\n${cases.length + 2} assessment checks passed\n`,
  )
}

try {
  main()
} catch (error) {
  console.error(
    "\nHarmonize assessment check failed\n",
  )

  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error(error)
  }

  process.exitCode = 1
}