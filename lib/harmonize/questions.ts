export type HarmonizePhase =
  | "witness"
  | "recognition"
  | "ownership"
  | "possibility"
  | "readiness"
  | "integration"
  | "review"

export type HarmonizeQuestion = {
  phase: HarmonizePhase
  key: string
  text: string
  purpose: string
}

export const harmonizeQuestions: HarmonizeQuestion[] = [
  {
    phase: "witness",
    key: "tell_me_what_happened",
    text: "Tell me what happened.",
    purpose: "Begin with the participant's lived experience without forcing pattern or ownership too soon.",
  },
  {
    phase: "witness",
    key: "what_stayed_with_you",
    text: "What stayed with you after it happened?",
    purpose: "Keep the participant in the experience layer while noticing what remains emotionally active.",
  },
  {
    phase: "witness",
    key: "bothered_most",
    text: "In what way did this bother you the most?",
    purpose: "Identify the most charged part of the experience without leading toward blame.",
  },
  {
    phase: "witness",
    key: "unfinished",
    text: "What feels unfinished about this for you?",
    purpose: "Surface unresolved material without assuming a pattern.",
  },

  {
    phase: "recognition",
    key: "as_you_reflect",
    text: "As you reflect on this, what feels most important now?",
    purpose: "Bring the participant into present awareness.",
  },
  {
    phase: "recognition",
    key: "where_you_go_inside",
    text: "As you reflect on this, what are you noticing about where you go inside?",
    purpose: "Move from event narration into internal recognition without assigning blame.",
  },
  {
    phase: "recognition",
    key: "feels_familiar",
    text: "As you reflect, does anything about this feel familiar?",
    purpose: "Invite pattern recognition without forcing it.",
  },

  {
    phase: "ownership",
    key: "conceal",
    text: "What do you usually conceal in that moment?",
    purpose: "Invite felt ownership without shame or self-blame.",
  },
  {
    phase: "ownership",
    key: "same_within_self",
    text: "What remained the same within yourself?",
    purpose: "Prevent outward blame during review and return the participant to agency.",
  },
  {
    phase: "ownership",
    key: "different_within_self",
    text: "What feels different within yourself?",
    purpose: "Track internal movement without requiring relationship change.",
  },

  {
    phase: "possibility",
    key: "possible_now",
    text: "What feels possible from where you are right now?",
    purpose: "Open choice without forcing repair.",
  },
  {
    phase: "possibility",
    key: "break_cycle_five_percent",
    text: "What would break this cycle by even 5%?",
    purpose: "Move toward precision, responsibility, and measurable practice.",
  },

  {
    phase: "readiness",
    key: "private_or_shared",
    text: "Would you like to keep this private, explore it further privately, or bring your own words into shared repair?",
    purpose: "Preserve consent before anything enters shared space.",
  },

  {
    phase: "integration",
    key: "different_in_relationship",
    text: "What feels different within the relationship?",
    purpose: "Track system movement, including change created by another participant.",
  },
  {
    phase: "integration",
    key: "seeing_now",
    text: "What are you seeing now that you were unable to see before?",
    purpose: "Name the new perspective created by the cycle.",
  },

  {
    phase: "review",
    key: "words_and_behavior",
    text: "Do the words and the behavior appear to be telling the same story?",
    purpose: "Review alignment without diagnosing or accusing.",
  },
]

export function getQuestionsByPhase(phase: HarmonizePhase) {
  return harmonizeQuestions.filter((question) => question.phase === phase)
}

export function getQuestionByKey(key: string) {
  return harmonizeQuestions.find((question) => question.key === key)
}