import type { HarmonizePhase } from "./questions"
import { getQuestionByKey } from "./questions"

export type HarmonizeFlowStep = {
  key: string
  phase: HarmonizePhase
  nextKey: string | null
}

export const harmonizeFlow: HarmonizeFlowStep[] = [
  {
    key: "tell_me_what_happened",
    phase: "witness",
    nextKey: "what_stayed_with_you",
  },
  {
    key: "what_stayed_with_you",
    phase: "witness",
    nextKey: "bothered_most",
  },
  {
    key: "bothered_most",
    phase: "witness",
    nextKey: "where_you_go_inside",
  },
  {
    key: "where_you_go_inside",
    phase: "recognition",
    nextKey: "conceal",
  },
  {
    key: "conceal",
    phase: "ownership",
    nextKey: "possible_now",
  },
  {
    key: "possible_now",
    phase: "possibility",
    nextKey: "private_or_shared",
  },
  {
    key: "private_or_shared",
    phase: "readiness",
    nextKey: null,
  },
]

export function getFlowStep(key: string) {
  return harmonizeFlow.find((step) => step.key === key)
}

export function getNextQuestionKey(currentKey: string) {
  return getFlowStep(currentKey)?.nextKey ?? null
}

export function getNextQuestion(currentKey: string) {
  const nextKey = getNextQuestionKey(currentKey)

  if (!nextKey) {
    return null
  }

  return getQuestionByKey(nextKey)
}

export function getFirstQuestion() {
  return getQuestionByKey("tell_me_what_happened")
}