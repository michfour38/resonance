import type {
  ShareReviewResult,
} from "@/lib/harmonize/share-review"
import { runELConversation } from "@/src/lib/el"

type PrivateWitnessEntry = {
  content: string
  promptText?: string | null
}

type BuildReckoningGuidanceInput = {
  draft: string
  assessment: ShareReviewResult
  privateEntries: PrivateWitnessEntry[]
}

const MAX_CONTEXT_ENTRIES = 6
const MAX_ENTRY_LENGTH = 2_000
const MAX_DRAFT_LENGTH = 5_000

function truncate(
  value: string,
  maximumLength: number,
): string {
  const text = value.trim()

  if (text.length <= maximumLength) {
    return text
  }

  return `${text.slice(0, maximumLength)}…`
}

function describeProtectedTruth(
  assessment: ShareReviewResult,
): string {
  const protectedTruthStatements: string[] = []

  if (assessment.protectedTruth.observableEvent) {
    protectedTruthStatements.push(
      "The participant described an observable event",
    )
  }

  if (assessment.protectedTruth.painOrImpact) {
    protectedTruthStatements.push(
      "The participant named pain or impact",
    )
  }

  if (
    assessment.protectedTruth.accountabilityRequest
  ) {
    protectedTruthStatements.push(
      "The participant requested accountability",
    )
  }

  if (assessment.protectedTruth.evidencedPattern) {
    protectedTruthStatements.push(
      "The participant identified a repeated pattern",
    )
  }

  if (
    assessment.protectedTruth.boundaryOrConsequence
  ) {
    protectedTruthStatements.push(
      "The participant expressed a boundary or consequence",
    )
  }

  if (
    assessment.protectedTruth.strongLanguagePresent
  ) {
    protectedTruthStatements.push(
      "Strong language is present but is not automatically wrongdoing",
    )
  }

  return protectedTruthStatements.length > 0
    ? protectedTruthStatements.join("\n")
    : "No protected element was detected by the deterministic review"
}

function buildPrivateConversation(
  entries: PrivateWitnessEntry[],
): Array<{
  role: "participant" | "system"
  content: string
}> {
  return entries
    .slice(-MAX_CONTEXT_ENTRIES)
    .flatMap((entry) => {
      const messages: Array<{
        role: "participant" | "system"
        content: string
      }> = []

      if (entry.promptText?.trim()) {
        messages.push({
          role: "system",
          content: truncate(
            entry.promptText,
            MAX_ENTRY_LENGTH,
          ),
        })
      }

      messages.push({
        role: "participant",
        content: truncate(
          entry.content,
          MAX_ENTRY_LENGTH,
        ),
      })

      return messages
    })
}

export async function buildReckoningGuidance({
  draft,
  assessment,
  privateEntries,
}: BuildReckoningGuidanceInput): Promise<string> {
  const fallbackQuestion =
    assessment.nextQuestion ||
    "What part of this response belongs to you?"

  const result = await runELConversation({
    product: "harmonize",
    stage: "shared_reckoning",

    latestAnswer: truncate(
      draft,
      MAX_DRAFT_LENGTH,
    ),

    conversation:
      buildPrivateConversation(privateEntries),

    contextBlocks: [
      {
        label: "RECKONING CONTRACT",
        content: `
The participant attempted to bring this draft into shared repair

The draft has not been shared

Do not rewrite the draft for the participant

Do not provide replacement wording

Do not defend the recipient

Do not ask the participant to minimise, forgive, release, choose peace, or soften the truth

Preserve observable events, pain, impact, evidenced patterns, accountability requests, boundaries, consequences, anger, and intensity

The task is to help the participant distinguish what happened from any movement that makes the other person contemptible

Respond with:

1. One short recognition of what remains true and protected
2. One precise question that investigates the assigned accountability rung

Ask only one question

The participant must produce their own accountable response
        `.trim(),
      },
      {
        label: "WHAT REMAINS PROTECTED",
        content:
          describeProtectedTruth(assessment),
      },
      {
        label: "MOVEMENT REQUIRING RECKONING",
        content: `
Risk type:
${assessment.riskType ?? "unspecified"}

Reason:
${assessment.reason ?? "Further reckoning is required"}

Flagged language:
${assessment.matchedExcerpt ?? "No exact excerpt available"}
        `.trim(),
      },
      {
        label: "ACCOUNTABILITY RUNG",
        content: `
Rung:
${assessment.recommendedRung ?? "ownership"}

Governing question:
${fallbackQuestion}

Remain on this rung unless the participant's own words clearly reveal that a preceding rung must be examined first
        `.trim(),
      },
      {
        label: "PRIVATE WITNESS BOUNDARY",
        content: `
The private witness conversation belongs only to this participant

Use it to understand their meaning and recurring pattern

Do not quote private witness material as though it will be shared

Do not compare this participant with the other participant

Do not make a judgement about which participant caused more harm

Each participant is held through their own reckoning
        `.trim(),
      },
    ],
  })

  return result?.reply?.trim() || fallbackQuestion
}