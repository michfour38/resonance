// app/compass/compass.service.ts

export type LensType =
  | "BELIEF"
  | "BOUNDARY"
  | "FEAR"
  | "GRIEF"
  | "GROWTH";

export type CompassStage =
  | "EMOTION_SCAN"
  | "EMOTION_CLARIFICATION"
  | "BELIEF_EXTRACTION"
  | "BELIEF_REFINEMENT"
  | "NEXT_STEP";

export interface CompassInput {
  rawInput: string;
  lens: LensType;
  confirmedEmotion?: string | null;
  confirmedBelief?: string | null;
}

export interface EmotionMatch {
  emotion: string;
  cluster: string;
}

export interface CompassOutput {
  lens: LensType;
  stage: CompassStage;
  userWords: string;
  detectedEmotions: EmotionMatch[];
  primaryEmotion: string | null;
  clarificationQuestion: string | null;
  possibleBelief: string | null;
  protectionQuestion: string | null;
  realityQuestion: string | null;
  refinedBeliefPrompt: string | null;
  nextHonestStep: string | null;
}

// -----------------------------
// Shared normalization
// -----------------------------

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// -----------------------------
// Emotion Directory
// Based on Dr Bradley Nelson-style emotion chart,
// used ONLY as a vocabulary directory, not diagnosis or truth.
// -----------------------------

const emotionDirectory = [
  {
    cluster: "ABANDONMENT_CLUSTER",
    emotions: [
      "abandonment",
      "betrayal",
      "forlorn",
      "lost",
      "love unreceived",
      "effort unreceived",
      "heartache",
      "insecurity",
      "overjoy",
      "vulnerability",
    ],
  },
  {
    cluster: "ANXIETY_CLUSTER",
    emotions: [
      "anxiety",
      "despair",
      "disgust",
      "nervousness",
      "worry",
      "failure",
      "helplessness",
      "hopelessness",
      "lack of control",
      "low self-esteem",
    ],
  },
  {
    cluster: "GRIEF_CLUSTER",
    emotions: [
      "crying",
      "discouragement",
      "rejection",
      "sadness",
      "sorrow",
      "confusion",
      "defensiveness",
      "grief",
      "self-abuse",
      "stubbornness",
    ],
  },
  {
    cluster: "ANGER_CLUSTER",
    emotions: [
      "anger",
      "bitterness",
      "guilt",
      "hatred",
      "resentment",
      "depression",
      "frustration",
      "indecisiveness",
      "panic",
      "taken for granted",
    ],
  },
  {
    cluster: "FEAR_CLUSTER",
    emotions: [
      "blaming",
      "dread",
      "fear",
      "horror",
      "peeved",
      "conflict",
      "creative insecurity",
      "terror",
      "unsupported",
      "wishy washy",
    ],
  },
  {
    cluster: "IDENTITY_CLUSTER",
    emotions: [
      "humiliation",
      "jealousy",
      "longing",
      "lust",
      "overwhelm",
      "pride",
      "shame",
      "shock",
      "unworthy",
      "worthless",
    ],
  },
];

// -----------------------------
// Emotion detection
// -----------------------------

export function detectEmotions(input: string): EmotionMatch[] {
  const text = normalizeText(input);
  const matches: EmotionMatch[] = [];

  for (const group of emotionDirectory) {
    for (const emotion of group.emotions) {
      if (text.includes(emotion)) {
        matches.push({
          emotion,
          cluster: group.cluster,
        });
      }
    }
  }

  return matches;
}

function buildEmotionClarificationQuestion(matches: EmotionMatch[]): string {
  if (matches.length === 0) {
    return "Which emotion feels closest right now: grief, fear, anger, abandonment, confusion, shame, or longing?";
  }

  if (matches.length === 1) {
    return `When you say "${matches[0].emotion}", is that the exact emotion, or is there another emotion underneath it?`;
  }

  const emotionList = matches.map((m) => m.emotion).join(", ");

  return `Several emotions may be present: ${emotionList}. Which one feels most central right now?`;
}

// -----------------------------
// Belief Lens
// -----------------------------

function buildBeliefQuestion(emotion: string): string {
  return `When ${emotion} is present, what does it make you believe is true?`;
}

function buildProtectionQuestion(emotion: string): string {
  return `What does holding onto ${emotion} protect you from facing too quickly?`;
}

function buildRealityQuestion(emotion: string): string {
  return `What is also true, even while ${emotion} is present?`;
}

function buildRefinedBeliefPrompt(emotion: string): string {
  return `Write a more complete belief that includes ${emotion}, but is not ruled by it.`;
}

function buildNextHonestStep(emotion: string): string {
  return `Choose one honest step that respects ${emotion} without letting it make the whole decision.`;
}

function runBeliefLens(input: CompassInput): CompassOutput {
  const userWords = input.rawInput.trim();
  const detectedEmotions = detectEmotions(userWords);
  const primaryEmotion =
    input.confirmedEmotion?.trim() ||
    (detectedEmotions.length === 1 ? detectedEmotions[0].emotion : null);

  if (!primaryEmotion) {
    return {
      lens: "BELIEF",
      stage: "EMOTION_CLARIFICATION",
      userWords,
      detectedEmotions,
      primaryEmotion: null,
      clarificationQuestion: buildEmotionClarificationQuestion(detectedEmotions),
      possibleBelief: null,
      protectionQuestion: null,
      realityQuestion: null,
      refinedBeliefPrompt: null,
      nextHonestStep: null,
    };
  }

  const possibleBelief =
    input.confirmedBelief?.trim() ||
    buildBeliefQuestion(primaryEmotion);

  return {
    lens: "BELIEF",
    stage: input.confirmedBelief ? "BELIEF_REFINEMENT" : "BELIEF_EXTRACTION",
    userWords,
    detectedEmotions,
    primaryEmotion,
    clarificationQuestion: null,
    possibleBelief,
    protectionQuestion: buildProtectionQuestion(primaryEmotion),
    realityQuestion: buildRealityQuestion(primaryEmotion),
    refinedBeliefPrompt: buildRefinedBeliefPrompt(primaryEmotion),
    nextHonestStep: buildNextHonestStep(primaryEmotion),
  };
}

// -----------------------------
// Main Compass Engine
// -----------------------------

export function runCompass(input: CompassInput): CompassOutput {
  switch (input.lens) {
    case "BELIEF":
      return runBeliefLens(input);

    case "BOUNDARY":
    case "FEAR":
    case "GRIEF":
    case "GROWTH":
    default:
      return {
        lens: input.lens,
        stage: "EMOTION_SCAN",
        userWords: input.rawInput,
        detectedEmotions: [],
        primaryEmotion: null,
        clarificationQuestion: "This lens is not implemented yet.",
        possibleBelief: null,
        protectionQuestion: null,
        realityQuestion: null,
        refinedBeliefPrompt: null,
        nextHonestStep: null,
      };
  }
}