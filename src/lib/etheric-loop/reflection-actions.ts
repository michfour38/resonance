export type ReflectionAction =
  | "accept_reflection"
  | "decline_reflection"
  | "resistant_acceptance"
  | "none"

export function detectReflectionAction(
  input: string,
): ReflectionAction {
  const normalized =
    input.toLowerCase().trim()

  if (
    normalized.includes("yes, reflect") ||
    normalized.includes("yes reflect")
  ) {
    return "accept_reflection"
  }

  if (
    normalized.includes("not right now")
  ) {
    return "decline_reflection"
  }

  if (
    normalized.includes("ugh fine") ||
    normalized.includes("tell me more")
  ) {
    return "resistant_acceptance"
  }

  return "none"
}