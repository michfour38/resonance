import {
  detectDependencyClusters,
} from "./dependency-cluster-engine"

import type {
  CompassAreaResponse,
  CompassGoalArea,
} from "./session-types"

export type PrimaryAreaReflection = {
  detectedArea: CompassGoalArea | null
  reflection: string
}

export function reflectPrimaryArea(
  responses: CompassAreaResponse[],
): PrimaryAreaReflection {
  if (responses.length === 0) {
    return {
      detectedArea: null,
      reflection:
        "Compass does not yet have enough information to reflect a possible primary area.",
    }
  }

  const clusters = detectDependencyClusters(responses)

  const strongestCluster = clusters[0]

  if (!strongestCluster) {
    return {
      detectedArea: null,
      reflection:
        "Compass could not yet identify a useful leverage point.",
    }
  }

  const detectedArea =
    strongestCluster.supportingAreas[0] as CompassGoalArea

  return {
    detectedArea,

    reflection: `
Several of your answers appear connected through ${strongestCluster.label}.

This appears across ${strongestCluster.supportingAreas.join(", ")}.

A decision in one area can create movement across several others.

This choice is not only about what feels biggest.

It is about where movement creates the greatest change.

Select the area that acts as the strongest lever for everything else you want to build.
`.trim(),
  }
}