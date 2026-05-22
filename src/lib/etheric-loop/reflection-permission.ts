import type { EthericLoopStateResult } from "./state-detection"
import type { TrajectoryAnalysis } from "./trajectory-analysis"
import type { ELBoundaryDecision } from "./constitutional-layer"

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
}: {
  state: EthericLoopStateResult
  trajectory: TrajectoryAnalysis
  boundaries: ELBoundaryDecision
  isSharedContext?: boolean
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

  if (!boundaries.allowDepth || boundaries.shouldSlowPacing) {
    reasoning.push("Depth or pacing is restricted by constitutional boundaries.")

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

  if (
    state.primaryState === "shame" ||
    state.primaryState === "freeze" ||
    state.primaryState === "collapse" ||
    state.primaryState === "overwhelm"
  ) {
    reasoning.push("Sensitive state detected. Reflection requires consent first.")

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

  if (
    trajectory.movementTrend === "stagnant" &&
    trajectory.recurringStates.length > 0
  ) {
    reasoning.push("Recurring state detected without visible movement.")

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
    reasoning.push("Shared context requires private permission before exposure.")

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