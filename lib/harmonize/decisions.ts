export type HarmonizeDecisionDestination =
  | "review"
  | "private"
  | "shared"

export type HarmonizeReadinessChoice = {
  key: string
  label: string
  description: string
  destination: HarmonizeDecisionDestination
}

export const readinessChoices: HarmonizeReadinessChoice[] = [
  {
    key: "keep_private",
    label: "Keep this private for now",
    description:
      "Nothing enters shared repair. You can review the cycle privately.",
    destination: "review",
  },
  {
    key: "explore_further",
    label: "Continue privately",
    description:
      "Stay in private reflection before deciding whether anything should be shared.",
    destination: "private",
  },
  {
    key: "shared_repair",
    label: "Bring my own words into shared repair",
    description:
      "Move into shared repair using only the words you intentionally choose.",
    destination: "shared",
  },
]