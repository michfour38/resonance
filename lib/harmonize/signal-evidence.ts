export type SignalEvidence = {
  signal: string
  evidence: string
}

export function collectSignalEvidence(content: string): SignalEvidence[] {
  const text = content.toLowerCase()

  const evidence: SignalEvidence[] = []

  if (text.includes("i notice")) {
    evidence.push({
      signal: "ownership",
      evidence: "i notice",
    })
  }

  if (text.includes("i realize")) {
    evidence.push({
      signal: "ownership",
      evidence: "i realize",
    })
  }

  if (text.includes("possible")) {
    evidence.push({
      signal: "possibility",
      evidence: "possible",
    })
  }

  if (text.includes("you always")) {
    evidence.push({
      signal: "absolute_language",
      evidence: "you always",
    })
  }

  if (text.includes("you never")) {
    evidence.push({
      signal: "absolute_language",
      evidence: "you never",
    })
  }

  return evidence
}