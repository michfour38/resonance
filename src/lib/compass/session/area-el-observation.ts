import {
  detectDependencyClusters,
  formatAreaList,
} from "./dependency-cluster-engine"

import type { CompassAreaResponse } from "./session-types"

export type CompassAreaELObservation = {
  dependencyCluster: string | null
  leverageArea: string | null
  bridgeQuestion: string
  reflection: string
}

export function buildAreaELObservation(
  responses: CompassAreaResponse[],
): CompassAreaELObservation {
  const clusters = detectDependencyClusters(responses)
  const strongestCluster = clusters[0] ?? null

  const leverageArea =
    strongestCluster?.supportingAreas[0] ?? responses[0]?.area ?? null

  const dependencyCluster = strongestCluster?.label ?? null

  const reflection = buildReflection({
    responses,
    strongestCluster,
  })

  const bridgeQuestion = dependencyCluster
    ? `Which area would create the strongest bridge between your current reality and the reality ${dependencyCluster} is helping you build?`
    : "Which area would create the strongest bridge between your current reality and the reality you want to create?"

  return {
    dependencyCluster,
    leverageArea,
    bridgeQuestion,
    reflection,
  }
}

function buildReflection({
  responses,
  strongestCluster,
}: {
  responses: CompassAreaResponse[]
  strongestCluster: ReturnType<typeof detectDependencyClusters>[number] | null
}): string {
  const strongestQuotes = getUniqueAreaQuotes(responses)

  if (!strongestCluster) {
    return `
${strongestQuotes}

Some themes appear stronger than others.

A clear direction has not fully emerged yet.

Where does movement create the greatest change?
`.trim()
  }

  return `
${strongestQuotes}

Several of your answers appear connected through ${strongestCluster.label}.

This appears across ${formatAreaList(strongestCluster.supportingAreas)}.

Movement in one area can sometimes create movement across several others.

Where does movement create the greatest change?
`.trim()
}

function getUniqueAreaQuotes(
  responses: CompassAreaResponse[],
): string {
  const seen = new Set<string>()

  return responses
    .slice()
    .sort(
      (a, b) =>
        b.languageWeight +
        b.emotionalWeight -
        (a.languageWeight + a.emotionalWeight),
    )
    .filter((response) => {
      if (seen.has(response.area)) return false
      seen.add(response.area)
      return true
    })
    .slice(0, 3)
    .map(
      (response) =>
        `In ${formatArea(response.area)}, you wrote: “${cleanReference(
          response.answer,
        )}”`,
    )
    .join("\n\n")
}

function formatArea(area: string): string {
  return area.charAt(0).toUpperCase() + area.slice(1)
}

function cleanReference(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ")

  if (trimmed.length <= 180) {
    return trimmed
  }

  return `${trimmed.slice(0, 180)}...`
}