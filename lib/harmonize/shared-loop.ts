export type SharedLoopSummary = {
  sharedEntryCount: number
  privateEntryCount: number
  pauseEntryCount: number
  hasSharedRepair: boolean
  hasPause: boolean
  loopStatus: "private_only" | "shared_started" | "paused" | "review_ready"
}

export function buildSharedLoopSummary(entries: any[]): SharedLoopSummary {
  const sharedEntryCount = entries.filter((e) => e.scope === "shared").length
  const privateEntryCount = entries.filter((e) => e.scope === "private").length
  const pauseEntryCount = entries.filter((e) => e.scope === "pause").length

  let loopStatus: SharedLoopSummary["loopStatus"] = "private_only"

  if (sharedEntryCount > 0) loopStatus = "shared_started"
  if (pauseEntryCount > 0) loopStatus = "paused"
  if (sharedEntryCount > 0 && privateEntryCount > 0) loopStatus = "review_ready"

  return {
    sharedEntryCount,
    privateEntryCount,
    pauseEntryCount,
    hasSharedRepair: sharedEntryCount > 0,
    hasPause: pauseEntryCount > 0,
    loopStatus,
  }
}