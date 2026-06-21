import type { AnchorDefinition } from "./anchor-definition-engine"
import {
  extractWitnessInvestigations,
  type WitnessInvestigation,
} from "./witness-investigation-engine"
import type { WitnessSignal } from "./witness-signal-engine"

type PrivateWitnessEntry = {
  content: string
  prompt_text?: string | null
}

function clean(text: string) {
  return text.replace(/\s+/g, " ").trim()
}

function formatInvestigations(investigations: WitnessInvestigation[]) {
  if (investigations.length === 0) {
    return "No stable investigation tension has emerged yet."
  }

  return investigations
    .map((investigation, index) =>
      [
        `${index + 1}. ${investigation.tension}`,
        `Confidence: ${investigation.confidence}`,
        `Evidence: ${investigation.evidence.join("; ")}`,
      ].join("\n"),
    )
    .join("\n\n")
}

export function buildWitnessContextBlocks(params: {
  entries: PrivateWitnessEntry[]
  anchorDefinition: AnchorDefinition | null
  strongestSignal: WitnessSignal | null
}) {
  const { entries, anchorDefinition, strongestSignal } = params
  const investigations = extractWitnessInvestigations(entries)

  return [
    {
      label: "Harmonize Private Witness Purpose",
      content:
        "Private Witness detects load-bearing relational tensions before shared repair. It should follow the strongest living signal, not a fixed question path.",
    },
    {
      label: "Current Anchor Evidence",
      content: anchorDefinition
        ? [
            `Anchor: ${anchorDefinition.anchor}`,
            `Type: ${anchorDefinition.type}`,
            `Confidence: ${anchorDefinition.confidence}`,
            `Source: ${strongestSignal?.source ?? "unknown"}`,
            `Evidence: ${anchorDefinition.evidence.join("; ")}`,
          ].join("\n")
        : "No stable anchor yet.",
    },
    {
      label: "Current Investigation Tensions",
      content: formatInvestigations(investigations),
    },
    {
      label: "Witness Trail",
      content:
        entries
          .map((entry, index) => {
            const question = entry.prompt_text
              ? `Question: ${clean(entry.prompt_text)}\n`
              : ""

            return `${index + 1}.\n${question}Answer: ${clean(entry.content)}`
          })
          .join("\n\n") || "No entries yet.",
    },
  ]
}

export function buildWitnessConversation(entries: PrivateWitnessEntry[]) {
  return entries.flatMap((entry) => {
    const messages = []

    if (entry.prompt_text) {
      messages.push({
        role: "system" as const,
        content: entry.prompt_text,
      })
    }

    messages.push({
      role: "participant" as const,
      content: entry.content,
    })

    return messages
  })
}