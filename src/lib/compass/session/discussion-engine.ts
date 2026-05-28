import {
  generateEthericLoopResponse,
} from "@/src/lib/etheric-loop/relational-response"

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
  const previousParticipantAnswers = messages
    .filter((message) => message.role === "participant")
    .map((message) => message.content)

  const permissionPromptCount =
    messages.filter(
      (message) =>
        message.role === "compass" &&
        isPermissionPrompt(message.content),
    ).length

  const response = generateEthericLoopResponse({
    latestAnswer,
    previousAnswers: previousParticipantAnswers,
    proposedStep,
    isSharedContext: false,
    reflectionStyle: "mixed",
    permissionPromptCount,
  })

  return {
    shouldContinueDiscussion: response.shouldContinue,
    compassReply: response.reply,
    suggestedMicroStep: response.suggestedMicroStep,
    detectedPattern: mapStateToPattern(
      response.state.primaryState,
    ),
  }
}

function isPermissionPrompt(content: string): boolean {
  return (
    content.includes("Would you like me to reflect") ||
    content.includes("A pattern may be repeating here") ||
    content.includes("Would you like to pause here") ||
    content.includes("Would you like help working through this privately")
  )
}

function mapStateToPattern(
  state: string,
):
  | "blocked"
  | "self_trust"
  | "avoidance"
  | "overwhelm"
  | "ready"
  | "unclear" {
  switch (state) {
    case "self_trust_gap":
      return "self_trust"

    case "avoidance":
      return "avoidance"

    case "overwhelm":
    case "freeze":
    case "collapse":
    case "shame":
      return "overwhelm"

    case "ready":
      return "ready"

    default:
      return "unclear"
  }
}