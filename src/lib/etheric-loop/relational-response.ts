import {
  detectReflectionAction,
} from "./reflection-actions"

import {
  evaluateConstitutionalBoundaries,
} from "./constitutional-layer"

import {
  evaluateReflectionPermission,
} from "./reflection-permission"

import {
  detectEthericLoopState,
  type EthericLoopStateResult,
} from "./state-detection"

import { analyzeTrajectory } from "./trajectory-analysis"

export type EthericLoopResponseInput = {
  latestAnswer: string
  previousAnswers?: string[]
  proposedStep?: string
  isSharedContext?: boolean
}

export type EthericLoopResponse = {
  state: EthericLoopStateResult
  reply: string
  suggestedMicroStep: string | null
  shouldContinue: boolean
}

export function generateEthericLoopResponse({
  latestAnswer,
  previousAnswers = [],
  proposedStep,
  isSharedContext = false,
}: EthericLoopResponseInput): EthericLoopResponse {
  const state = detectEthericLoopState(latestAnswer)
  const reflectionAction = detectReflectionAction(latestAnswer)

  if (reflectionAction === "decline_reflection") {
    return {
      state,
      reply: `
That’s okay.

We do not need to force clarity before you are ready for it.

Sometimes stepping away, sitting with the discomfort, or returning later is part of the process too.
`.trim(),
      suggestedMicroStep: null,
      shouldContinue: true,
    }
  }

  if (reflectionAction === "accept_reflection") {
    return {
      state,
      reply: `
Alright.

What I may be noticing is that this is carrying more emotional weight than practical difficulty.

That usually means the action itself is not the only thing being reacted to.

What feels most threatened underneath this?
`.trim(),
      suggestedMicroStep: null,
      shouldContinue: true,
    }
  }

  if (reflectionAction === "resistant_acceptance") {
    return {
      state,
      reply: `
Fair enough.

Resistance usually appears for a reason.

Sometimes part of us already knows something is true before we feel ready to fully look at it.

So let’s slow this down instead of forcing intensity.

What part feels hardest to honestly admit here?
`.trim(),
      suggestedMicroStep: null,
      shouldContinue: true,
    }
  }

  const trajectory = analyzeTrajectory([...previousAnswers, latestAnswer])

  const boundaries = evaluateConstitutionalBoundaries({
    detectedState: state.primaryState,
    recentStates: trajectory.recurringStates,
    answerLength: latestAnswer.trim().length,
  })

  const permission = evaluateReflectionPermission({
    state,
    trajectory,
    boundaries,
    isSharedContext,
  })

  if (permission.shouldOfferReflection && permission.prompt) {
    return {
      state,
      reply: buildPermissionReply(
        permission.privateNotice,
        permission.prompt,
      ),
      suggestedMicroStep: null,
      shouldContinue: true,
    }
  }

  return {
    state,
    reply: buildReply({
      latestAnswer,
      previousAnswers,
      proposedStep,
      state,
      trajectory,
    }),
    suggestedMicroStep: proposedStep ? softenStep(proposedStep) : null,
    shouldContinue: state.primaryState !== "ready",
  }
}

function buildPermissionReply(
  privateNotice: string | null,
  prompt: string,
): string {
  return [privateNotice, prompt].filter(Boolean).join("\n\n")
}

function buildReply({
  latestAnswer,
  previousAnswers,
  proposedStep,
  state,
  trajectory,
}: {
  latestAnswer: string
  previousAnswers: string[]
  proposedStep?: string
  state: EthericLoopStateResult
  trajectory: ReturnType<typeof analyzeTrajectory>
}) {
  const reference = cleanReference(latestAnswer)
  const previous = previousAnswers.filter(Boolean).slice(-2)

  if (
    trajectory.recurringStates.length > 0 &&
    trajectory.movementTrend === "stagnant"
  ) {
    return `
This is not appearing as a one-time block anymore.

A similar state is repeating across what you have shared.

You wrote: “${reference}”

What feels most true:
you do not know the next step,
or you know enough to begin but do not yet feel safe following through?
`.trim()
  }

  if (state.primaryState === "self_trust_gap") {
    return `
This does not sound like a lack of desire.

It sounds like follow-through needs to become smaller and more keepable.

You wrote: “${reference}”

What is one agreement so small that keeping it would begin to prove: I do what I say I will do?
`.trim()
  }

  if (state.primaryState === "overwhelm") {
    return `
This sounds too large inside your system right now.

You wrote: “${reference}”

What would be the smallest version of this that would not require you to perform, prove, or force anything?
`.trim()
  }

  if (state.primaryState === "avoidance") {
    return `
This may be less about not knowing what to do, and more about what happens when discomfort appears.

You wrote: “${reference}”

What do you usually do in the first few minutes after the discomfort arrives?
`.trim()
  }

  if (state.primaryState === "freeze") {
    return `
This sounds like freeze, not laziness.

You wrote: “${reference}”

What feels most frozen here: the decision, the first movement, the fear of failing, or the fear of being seen trying?
`.trim()
  }

  if (state.primaryState === "shame") {
    return `
There is self-judgment in this.

You wrote: “${reference}”

If you were not allowed to speak to yourself harshly about this, what would still be true?
`.trim()
  }

  if (state.primaryState === "collapse") {
    return `
This sounds like collapse energy.

You wrote: “${reference}”

What is one tiny action that would not need hope to complete — only willingness?
`.trim()
  }

  if (state.primaryState === "urgency") {
    return `
There is pressure in this.

You wrote: “${reference}”

What part feels heaviest right now:
starting,
deciding,
failing,
or carrying this alone?
`.trim()
  }

  if (state.primaryState === "ready") {
    return `
Good.

Do not make the next step bigger now.

${proposedStep ? `Start with this:\n${softenStep(proposedStep)}` : "Choose one action you can complete today and stop there."}
`.trim()
  }

  if (previous.length > 0) {
    return `
You may not be lacking direction.

You wrote: “${reference}”

What feels more true right now: you do not know what to do, or you know enough to begin but do not yet trust yourself to follow through?
`.trim()
  }

  return `
There is something useful in what you wrote:

“${reference}”

Before we choose a step, let’s be honest about the kind of difficulty this is.

Is the struggle practical, emotional, self-trust based, or fear-based?
`.trim()
}

function softenStep(step: string): string {
  const cleaned = step.trim()

  if (!cleaned) {
    return "Choose one small action you can complete today."
  }

  return `Reduce this until it can be completed today:\n${cleaned}`
}

function cleanReference(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ")

  if (trimmed.length <= 140) return trimmed

  return `${trimmed.slice(0, 140)}...`
}