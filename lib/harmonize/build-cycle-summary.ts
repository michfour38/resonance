export type HarmonizeCycleSummary = {
  ownershipCount: number
  possibilityCount: number
  contemptCount: number
  absoluteLanguageCount: number
  mimicryCount: number
}

export function buildCycleSummary(signals: any[]) {
  return {
    ownershipCount: signals.filter(
      (s) => s.type === "ownership",
    ).length,

    possibilityCount: signals.filter(
      (s) => s.type === "possibility",
    ).length,

    contemptCount: signals.filter(
      (s) => s.type === "contempt",
    ).length,

    absoluteLanguageCount: signals.filter(
      (s) => s.type === "absolute_language",
    ).length,

    mimicryCount: signals.filter(
      (s) => s.type === "mimicry",
    ).length,
  }
}