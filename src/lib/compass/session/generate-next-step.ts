import type {
  CompassExecutionCheck,
  CompassResistanceMap,
} from "./session-types"

export function generateNextStep({
  goal,
  resistance,
  execution,
}: {
  goal: string
  resistance: CompassResistanceMap | null
  execution: CompassExecutionCheck | null
}): string {
  if (
    execution &&
    !execution.isStepExecutable &&
    execution.recalibratedStep
  ) {
    return execution.recalibratedStep
  }

  const avoidance =
    resistance?.avoidancePattern ?? ""

  if (avoidance === "overthinking") {
    return `
Do not attempt to solve the entire goal today.

Choose one contained action that creates movement:
- open the page,
- review the document,
- send the message,
- make the call,
- walk into the environment,
- begin with observation instead of pressure.

Embodied momentum matters more than fantasy intensity.
`.trim()
  }

  if (avoidance === "collapse") {
    return `
Reduce the demand level temporarily.

Your next step is not maximum performance.
Your next step is sustainable re-entry.

Choose the smallest action that restores consistency without overwhelming your nervous system.
`.trim()
  }

  if (avoidance === "perfectionism") {
    return `
The goal is not flawless execution.

The goal is repeated aligned movement.

Complete one imperfect but real action today instead of waiting for ideal conditions.
`.trim()
  }

  return `
Based on your responses, it seems the pressure surrounding this goal may currently be heavier than the action itself.

So rather than forcing momentum, Compass will help narrow this into something emotionally sustainable.

The goal is not intensity.
The goal is rebuilding movement without abandoning yourself in the process.
`.trim()
}