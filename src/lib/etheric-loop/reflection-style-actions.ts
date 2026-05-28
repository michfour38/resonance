import type { ELReflectionStyle } from "./reflection-style"

export type ELReflectionStyleAction =
  | "set_gentle"
  | "set_direct"
  | "set_mixed"
  | "none"

export function detectReflectionStyleAction(
  input: string,
): ELReflectionStyleAction {
  const normalized = input.toLowerCase().trim()

  if (
    normalized.includes("stay gentle") ||
    normalized.includes("gentle")
  ) {
    return "set_gentle"
  }

  if (
    normalized.includes("be direct") ||
    normalized.includes("direct") ||
    normalized.includes("blunt")
  ) {
    return "set_direct"
  }

  if (
    normalized.includes("mix both") ||
    normalized.includes("mixed")
  ) {
    return "set_mixed"
  }

  return "none"
}

export function mapStyleActionToStyle(
  action: ELReflectionStyleAction,
): ELReflectionStyle | null {
  switch (action) {
    case "set_gentle":
      return "gentle"

    case "set_direct":
      return "direct"

    case "set_mixed":
      return "mixed"

    default:
      return null
  }
}