export type ELReflectionStyle =
  | "gentle"
  | "direct"
  | "mixed"

export type ELReflectionStyleSelection = {
  style: ELReflectionStyle
  label: string
  description: string
}

export const REFLECTION_STYLE_OPTIONS: ELReflectionStyleSelection[] = [
  {
    style: "gentle",
    label: "Stay gentle",
    description:
      "Ask before reflecting. Slow the pacing when things feel emotionally heavy.",
  },

  {
    style: "direct",
    label: "Be direct",
    description:
      "Reduce cushioning. Offer clearer prompts and reflections without repeated permission checks.",
  },

  {
    style: "mixed",
    label: "Mix both",
    description:
      "Stay direct during loops and practical moments, but ask permission when emotional intensity increases.",
  },
]

export function shouldAskPermission({
  style,
  emotionalIntensity,
  repeatedResistance,
}: {
  style: ELReflectionStyle
  emotionalIntensity: boolean
  repeatedResistance: boolean
}): boolean {
  if (style === "gentle") {
    return true
  }

  if (style === "direct") {
    return emotionalIntensity
  }

  return (
    emotionalIntensity ||
    repeatedResistance
  )
}