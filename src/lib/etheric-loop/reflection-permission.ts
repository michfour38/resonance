import type { EthericLoopStateResult } from "./state-detection"
import type { TrajectoryAnalysis } from "./trajectory-analysis"
import type { ELBoundaryDecision } from "./constitutional-layer"

import {
  shouldAskPermission,
  type ELReflectionStyle,
} from "./reflection-style"

export type ELReflectionPermissionChoice =
  | "yes_reflect"
  | "not_right_now"
  | "ugh_fine_tell_me_more"

export type ELReflectionPermissionMode =
  | "ask_permission"
  | "continue_without_reflection"
  | "hold_private"
  | "slow_down"

export type ELReflectionPermissionDecision = {
  mode: ELReflectionPermissionMode
  privateNotice: string | null
  prompt: string | null
  choices: {
    label: string
    value: ELReflectionPermissionChoice
  }[]
  shouldOfferReflection: boolean
  shouldReduceIntensity: boolean
  reasoning: string[]
}

export function evaluateReflectionPermission({
  state,
  trajectory,
  boundaries,
  isSharedContext = false,
  reflectionStyle = "mixed",
permissionPromptCount = 0,
}: {
  state: EthericLoopStateResult
  trajectory: TrajectoryAnalysis
  boundaries: ELBoundaryDecision
  isSharedContext?: boolean
  reflectionStyle?: ELReflectionStyle
  permissionPromptCount?: number
}): ELReflectionPermissionDecision {
  const reasoning: string[] = []

  const choices = [
    { label: "Yes, reflect", value: "yes_reflect" as const },
    { label: "Not right now", value: "not_right_now" as const },
    {
      label: "Ugh fine — tell me more",
      value: "ugh_fine_tell_me_more" as const,
    },
  ]

  const privateNotice = isSharedContext
    ? "Your response here is private until we work through this together."
    : null

const shouldOfferStyleSelection =
  permissionPromptCount >= 2

  const emotionalIntensity =
    state.primaryState === "shame" ||
    state.primaryState === "freeze" ||
    state.primaryState === "collapse" ||
    state.primaryState === "overwhelm"

  const repeatedResistance =
    trajectory.recurringStates.length > 0 &&
    trajectory.movementTrend === "stagnant"

  const permissionRequired = shouldAskPermission({
    style: reflectionStyle,
    emotionalIntensity,
    repeatedResistance,
  })

  if (!permissionRequired) {
    return {
      mode: "continue_without_reflection",
      privateNotice,
      prompt: null,
      choices: [],
      shouldOfferReflection: false,
      shouldReduceIntensity: false,
      reasoning: [
        "Reflection style allows direct reflection without permission gate.",
      ],
    }
  }

if (shouldOfferStyleSelection) {
  return {
    mode: "ask_permission",
    privateNotice,
    prompt: `
We may be slowing down too much for your preference.

How would you like Compass to work with you from here?
`.trim(),
    choices: [
      {
        label: "Stay gentle",
        value: "yes_reflect",
      },
      {
        label: "Be direct",
        value: "ugh_fine_tell_me_more",
      },
      {
        label: "Mix both",
        value: "not_right_now",
      },
    ],
    shouldOfferReflection: true,
    shouldReduceIntensity: false,
    reasoning: [
      "Participant has encountered multiple permission gates.",
    ],
  }
}

  if (!boundaries.allowDepth || boundaries.shouldSlowPacing) {
    reasoning.push(
      "Depth or pacing is restricted by constitutional boundaries.",
    )

    return {
      mode: "slow_down",
      privateNotice,
      prompt:
        "We do not need to go deeper immediately. Would you like to pause here, or gently reflect on what may be underneath this?",
      choices,
      shouldOfferReflection: true,
      shouldReduceIntensity: true,
      reasoning,
    }
  }

  if (emotionalIntensity) {
    reasoning.push(
      "Sensitive state detected. Reflection requires consent first.",
    )

    return {
      mode: "ask_permission",
      privateNotice,
      prompt:
        "Something in this may need care before interpretation. Would you like me to reflect what I’m noticing?",
      choices,
      shouldOfferReflection: true,
      shouldReduceIntensity: true,
      reasoning,
    }
  }

  if (repeatedResistance) {
    reasoning.push(
      "Recurring state detected without visible movement.",
    )

    return {
      mode: "ask_permission",
      privateNotice,
      prompt:
        "A pattern may be repeating here. Would you like me to reflect what seems to be looping?",
      choices,
      shouldOfferReflection: true,
      shouldReduceIntensity: false,
      reasoning,
    }
  }

  if (isSharedContext) {
    reasoning.push(
      "Shared context requires private permission before exposure.",
    )

    return {
      mode: "hold_private",
      privateNotice,
      prompt:
        "Before anything is shared, would you like help working through this privately?",
      choices,
      shouldOfferReflection: true,
      shouldReduceIntensity: true,
      reasoning,
    }
  }

  reasoning.push("No permission gate required yet.")

  return {
    mode: "continue_without_reflection",
    privateNotice,
    prompt: null,
    choices: [],
    shouldOfferReflection: false,
    shouldReduceIntensity: false,
    reasoning,
  }
}