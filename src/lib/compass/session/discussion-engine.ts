export type CompassDiscussionMessage = {
  role: "participant" | "compass"
  content: string
}

export type CompassDiscussionResult = {
  shouldContinueDiscussion: boolean
  compassReply: string
  suggestedMicroStep: string | null
  detectedPattern:
    | "blocked"
    | "self_trust"
    | "avoidance"
    | "overwhelm"
    | "ready"
    | "unclear"
}

export function continueCompassDiscussion({
  messages,
  latestAnswer,
  proposedStep,
}: {
  messages: CompassDiscussionMessage[]
  latestAnswer: string
  proposedStep: string
}): CompassDiscussionResult {
  const normalized = latestAnswer.toLowerCase().trim()

  if (isBlockedAnswer(normalized)) {
    return {
      shouldContinueDiscussion: true,
      detectedPattern: "blocked",
      suggestedMicroStep: null,
      compassReply:
        "That may be true, but it may also be protecting you from looking more closely. Is it closer to: you do not know what to do, you know but it feels too much, or you do not trust yourself to follow through yet?",
    }
  }

  if (mentionsSelfTrust(normalized)) {
    return {
      shouldContinueDiscussion: true,
      detectedPattern: "self_trust",
      suggestedMicroStep: buildMicroStep(proposedStep),
      compassReply:
        "Confidence in the self to follow through is built through kept agreements. What is one tiny promise you could keep today — not to impress anyone, but simply to experience yourself following through?",
    }
  }

  if (mentionsOverwhelm(normalized)) {
    return {
      shouldContinueDiscussion: true,
      detectedPattern: "overwhelm",
      suggestedMicroStep: buildMicroStep(proposedStep),
      compassReply:
        "This may not need a bigger plan yet. It may need a smaller entry point. What is the tiniest version of this action that still counts as movement?",
    }
  }

  if (mentionsAvoidance(normalized)) {
    return {
      shouldContinueDiscussion: true,
      detectedPattern: "avoidance",
      suggestedMicroStep: buildMicroStep(proposedStep),
      compassReply:
        "The core here may be staying with the discomfort instead of escaping it. What do you usually do immediately after discomfort appears?",
    }
  }

  if (seemsReady(normalized)) {
    return {
      shouldContinueDiscussion: false,
      detectedPattern: "ready",
      suggestedMicroStep: proposedStep,
      compassReply:
        "Good. Then the next step should stay small enough to complete and clear enough to know when it is done. Do it once. Return after completion if you want to refine the next move.",
    }
  }

  return {
    shouldContinueDiscussion: true,
    detectedPattern: "unclear",
    suggestedMicroStep: buildMicroStep(proposedStep),
    compassReply:
      "There is useful information in what you wrote. Before we finalize the step, what part feels most true: the goal itself, the resistance, the fear of starting, or the pressure to get it right?",
  }
}

function isBlockedAnswer(value: string): boolean {
  const blockedAnswers = [
    "i don't know",
    "i dont know",
    "idk",
    "not sure",
    "unsure",
    "maybe",
    "yes",
    "no",
    "ok",
    "okay",
  ]

  return blockedAnswers.includes(value) || value.split(/\s+/).length <= 2
}

function mentionsSelfTrust(value: string): boolean {
  return (
    value.includes("trust myself") ||
    value.includes("self trust") ||
    value.includes("follow through") ||
    value.includes("i never do") ||
    value.includes("i don't do") ||
    value.includes("i dont do") ||
    value.includes("i give up") ||
    value.includes("i fail")
  )
}

function mentionsOverwhelm(value: string): boolean {
  return (
    value.includes("too much") ||
    value.includes("overwhelmed") ||
    value.includes("overwhelming") ||
    value.includes("exhausted") ||
    value.includes("tired") ||
    value.includes("can't") ||
    value.includes("cannot")
  )
}

function mentionsAvoidance(value: string): boolean {
  return (
    value.includes("avoid") ||
    value.includes("escape") ||
    value.includes("distract") ||
    value.includes("procrastinate") ||
    value.includes("delay") ||
    value.includes("scroll") ||
    value.includes("freeze")
  )
}

function seemsReady(value: string): boolean {
  return (
    value.includes("i can do") ||
    value.includes("i will do") ||
    value.includes("i'm ready") ||
    value.includes("im ready") ||
    value.includes("this feels doable") ||
    value.includes("doable") ||
    value.includes("i can start")
  )
}

function buildMicroStep(proposedStep: string): string {
  return `
Reduce the step until it becomes almost impossible to avoid.

Do not aim for transformation yet.

Aim for one kept agreement.

Suggested micro-step:
${proposedStep}
`.trim()
}