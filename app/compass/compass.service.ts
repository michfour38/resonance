// app/compass/compass.service.ts

export type LensType =
  | "BELIEF"
  | "BOUNDARY"
  | "FEAR"
  | "GRIEF"
  | "GROWTH";

export interface CompassInput {
  rawInput: string;
  lens: LensType;
}

export interface BeliefDetectionResult {
  detectedPattern: string | null;
  beliefHypothesis: string | null;
  confidence: number;
}

export interface CompassOutput {
  state: string;
  if: string;
  then: string;
  else: string;
  observe: string;
  repair: string;
  nextStep: string;
  belief?: string | null;
  pattern?: string | null;
}

// -----------------------------
// 🧠 SHARED NORMALIZATION (align with Journey)
// -----------------------------

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// -----------------------------
// 🧠 BELIEF PATTERN LIBRARY (v2)
// Now closer to Journey-style detection
// -----------------------------

const beliefPatterns = [
  {
    pattern: "DEPENDENCY",
    signals: ["can't live without", "need them to be okay", "i need them"],
    belief: "I cannot exist fully without them",
    weight: 3,
  },
  {
    pattern: "PERMANENCE",
    signals: ["forever", "never supposed to end", "always meant to be"],
    belief: "This was meant to last forever",
    weight: 2,
  },
  {
    pattern: "CONTROL_VIOLATION",
    signals: ["shouldn't have happened", "this isn't right", "not supposed to happen"],
    belief: "This outcome was not allowed to happen",
    weight: 3,
  },
  {
    pattern: "IDENTITY_MERGE",
    signals: ["who am i without", "i am nothing without", "without them i am"],
    belief: "My identity is tied to this person",
    weight: 3,
  },
  {
    pattern: "DIVINE_CONFLICT",
    signals: ["god wouldn't", "why would god", "god shouldn't"],
    belief: "A higher power should have prevented this",
    weight: 2,
  },
];

// -----------------------------
// 🧠 BELIEF DETECTION (scored, not binary)
// -----------------------------

export function detectBelief(input: string): BeliefDetectionResult {
  const text = normalizeText(input);

  let bestMatch: BeliefDetectionResult = {
    detectedPattern: null,
    beliefHypothesis: null,
    confidence: 0,
  };

  for (const pattern of beliefPatterns) {
    let score = 0;

    for (const signal of pattern.signals) {
      if (text.includes(signal)) {
        score += pattern.weight;
      }
    }

    if (score > bestMatch.confidence) {
      bestMatch = {
        detectedPattern: pattern.pattern,
        beliefHypothesis: pattern.belief,
        confidence: score,
      };
    }
  }

  return bestMatch;
}

// -----------------------------
// 🧭 BELIEF LENS (aligned with YOUR system)
// -----------------------------

function runBeliefLens(input: string): CompassOutput {
  const detection = detectBelief(input);

  const belief = detection.beliefHypothesis;

  return {
    pattern: detection.detectedPattern,
    belief,

    state: "I am uncovering the belief driving my emotional response",

    if: "A strong emotional reaction or recurring thought appears",

    then: belief
      ? `Identify the belief: "${belief}"`
      : "Identify the belief underneath the emotion",

    // 🔁 YOUR ELSE (not softened, not forced)
    else:
      "If clarity is not yet visible, I continue the search while allowing the emotion, returning to the belief until it becomes clear",

    observe:
      "Notice which beliefs repeat across different emotional waves",

    repair:
      "Test the belief against reality and refine it if it no longer holds",

    nextStep: belief
      ? `Sit with: "${belief}" and ask: is this fully true?`
      : "Ask: What must be true for me to feel this way?",
  };
}

// -----------------------------
// 🧭 MAIN ENGINE
// -----------------------------

export function runCompass(input: CompassInput): CompassOutput {
  switch (input.lens) {
    case "BELIEF":
      return runBeliefLens(input.rawInput);

    // Future lenses plug in here cleanly
    case "BOUNDARY":
    case "FEAR":
    case "GRIEF":
    case "GROWTH":
    default:
      return {
        state: "Lens not implemented yet",
        if: "",
        then: "",
        else: "",
        observe: "",
        repair: "",
        nextStep: "",
      };
  }
}