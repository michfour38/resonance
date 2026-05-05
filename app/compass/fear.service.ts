// app/compass/fear.service.ts

export type FearStepKey =
  | "signal"
  | "projection"
  | "realityCheck"
  | "presentReality"
  | "consideredAction"
  | "actionAlignment"
  | "control"
  | "outputType"
  | "nextStep";

export type FearStage =
  | "SIGNAL_DETECTED"
  | "PROJECTION_EXPOSED"
  | "REALITY_ANCHORED"
  | "ACTION_EXAMINED"
  | "DISTORTION_CHECKED"
  | "CONTROL_RESTORED"
  | "OUTPUT_CLASSIFIED"
  | "NEXT_STEP_CHOSEN"
  | "REGRESSION_DETECTED";

export type RealityCheckAnswer = "yes" | "no" | "unclear" | "";

export type DistortionType =
  | "projection"
  | "assumed_meaning"
  | "urgency"
  | "helplessness"
  | "none";

export type InterventionLevel =
  | "none"
  | "soft_redirect"
  | "hard_return";

export type CompassOutputType = "ACT" | "HOLD" | "OBSERVE" | "";

export interface FearAnswers {
  signal: string;
  projection: string;
  realityCheck: RealityCheckAnswer;
  presentReality: string;
  consideredAction: string;
  actionAlignment: string;
  control: string;
  outputType: CompassOutputType;
  nextStep: string;
}

export interface FearPrompt {
  stepKey: FearStepKey;
  stage: FearStage;
  title: string;
  prompt: string;
  placeholder: string;
  helperText?: string | null;
  inputType: "text" | "textarea" | "choice";
  choices?: { label: string; value: string }[];
}

export interface FearLensOutput {
  stage: FearStage;
  currentPrompt: FearPrompt | null;
  isComplete: boolean;

  distortionType: DistortionType;
  distortionCount: number;
  interventionLevel: InterventionLevel;

  regressionDetected: boolean;
  regressionReason: DistortionType | null;

  summary: {
    signal: string;
    projection: string;
    presentReality: string;
    consideredAction: string;
    actionAlignment: string;
    control: string;
    outputType: CompassOutputType;
    nextStep: string;
  } | null;
}

export const initialFearAnswers: FearAnswers = {
  signal: "",
  projection: "",
  realityCheck: "",
  presentReality: "",
  consideredAction: "",
  actionAlignment: "",
  control: "",
  outputType: "",
  nextStep: "",
};

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function hasAny(text: string, patterns: string[]): boolean {
  const normalized = normalizeText(text);
  return patterns.some((pattern) => normalized.includes(pattern));
}

function isAnswered(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

// ─────────────────────────────────────────────
// Distortion detection
// Compass classifies language.
// It does not judge the user.
// ─────────────────────────────────────────────

export function detectDistortion(text: string): {
  distortionType: DistortionType;
  distortionCount: number;
} {
  const projectionPatterns = [
    "what if",
    "might",
    "maybe",
    "probably",
    "i think they",
    "i feel like they",
    "they will",
    "this will",
    "it will",
    "i'm scared that",
    "im scared that",
    "i'm worried that",
    "im worried that",
    "i'm concerned that",
    "im concerned that",
  ];

  const assumedMeaningPatterns = [
    "this means",
    "that means",
    "it means",
    "because they don't",
    "because they dont",
    "they must not",
    "they clearly",
    "obviously",
    "clearly",
    "so they don't",
    "so they dont",
  ];

  const urgencyPatterns = [
    "right now",
    "immediately",
    "i have to",
    "i need to fix",
    "i need them to",
    "i can't wait",
    "i cant wait",
    "before it's too late",
    "before its too late",
  ];

  const helplessnessPatterns = [
    "i can't",
    "i cant",
    "there is nothing",
    "nothing i can do",
    "i have no choice",
    "i'm stuck",
    "im stuck",
    "i don't know what to do",
    "i dont know what to do",
  ];

  const matches: DistortionType[] = [];

  if (hasAny(text, projectionPatterns)) matches.push("projection");
  if (hasAny(text, assumedMeaningPatterns)) matches.push("assumed_meaning");
  if (hasAny(text, urgencyPatterns)) matches.push("urgency");
  if (hasAny(text, helplessnessPatterns)) matches.push("helplessness");

  if (matches.length === 0) {
    return {
      distortionType: "none",
      distortionCount: 0,
    };
  }

  return {
    distortionType: matches[0],
    distortionCount: matches.length,
  };
}

export function getInterventionLevel(
  distortionCount: number
): InterventionLevel {
  if (distortionCount === 0) return "none";
  if (distortionCount === 1) return "soft_redirect";
  return "hard_return";
}

function buildRegressionPrompt(
  distortionType: DistortionType,
  interventionLevel: InterventionLevel
): FearPrompt {
  const helperText =
    interventionLevel === "hard_return"
      ? "Your language moved away from what is directly known. Compass is returning to the present."
      : "There may be extra meaning or future projection in the wording. Bring it back to what is known.";

  const prompt =
    distortionType === "assumed_meaning"
      ? "What happened — before adding what it might mean?"
      : distortionType === "urgency"
        ? "What is happening now that actually requires immediate action?"
        : distortionType === "helplessness"
          ? "What is still within your control right now?"
          : "What is actually happening right now?";

  return {
    stepKey: "presentReality",
    stage: "REGRESSION_DETECTED",
    title: "Return to what is known.",
    prompt,
    placeholder: "Only what is directly observable.",
    helperText,
    inputType: "textarea",
  };
}

// ─────────────────────────────────────────────
// Step progression
// ─────────────────────────────────────────────

function getNextUnansweredStep(answers: FearAnswers): FearStepKey | null {
  if (!isAnswered(answers.signal)) return "signal";
  if (!isAnswered(answers.projection)) return "projection";
  if (!answers.realityCheck) return "realityCheck";
  if (!isAnswered(answers.presentReality)) return "presentReality";
  if (!isAnswered(answers.consideredAction)) return "consideredAction";
  if (!isAnswered(answers.actionAlignment)) return "actionAlignment";
  if (!isAnswered(answers.control)) return "control";
  if (!answers.outputType) return "outputType";
  if (!isAnswered(answers.nextStep)) return "nextStep";

  return null;
}

function buildPromptForStep(
  stepKey: FearStepKey,
  answers: FearAnswers
): FearPrompt {
  switch (stepKey) {
    case "signal":
      return {
        stepKey,
        stage: "SIGNAL_DETECTED",
        title: "What feels off?",
        prompt:
          "Start with the signal. What is creating tension, uncertainty, or discomfort?",
        placeholder: "Write the situation plainly.",
        inputType: "textarea",
      };

    case "projection":
      return {
        stepKey,
        stage: "PROJECTION_EXPOSED",
        title: "Let the concern show itself.",
        prompt: "If this plays out — what are you concerned might happen?",
        placeholder: "Write the outcome you are bracing for.",
        inputType: "textarea",
      };

    case "realityCheck":
      return {
        stepKey,
        stage: "REALITY_ANCHORED",
        title: "Check the present.",
        prompt: "Is that happening right now?",
        placeholder: "",
        helperText:
          "This is not asking whether it could happen. Only whether it is happening now.",
        inputType: "choice",
        choices: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Unclear", value: "unclear" },
        ],
      };

    case "presentReality": {
      const prompt =
        answers.realityCheck === "yes"
          ? "What is happening — without adding meaning to it?"
          : answers.realityCheck === "no"
            ? "What is actually happening right now?"
            : "What do you know for certain right now?";

      return {
        stepKey,
        stage: "REALITY_ANCHORED",
        title: "Name reality.",
        prompt,
        placeholder: "Facts only. No prediction. No meaning added.",
        inputType: "textarea",
      };
    }

    case "consideredAction":
      return {
        stepKey,
        stage: "ACTION_EXAMINED",
        title: "Name the impulse.",
        prompt:
          "Given what is actually happening — what are you considering doing?",
        placeholder:
          "Write the action, message, withdrawal, delay, or decision you are considering.",
        inputType: "textarea",
      };

    case "actionAlignment":
      return {
        stepKey,
        stage: "DISTORTION_CHECKED",
        title: "Test the action.",
        prompt:
          "Does that action match what is actually happening — or what you are concerned might happen?",
        placeholder:
          "Name whether the action matches reality, the concern, or both.",
        inputType: "textarea",
      };

    case "control":
      return {
        stepKey,
        stage: "CONTROL_RESTORED",
        title: "Return to control.",
        prompt: "What is within your control right now?",
        placeholder:
          "Name only what you can actually do, choose, pause, say, or not do.",
        inputType: "textarea",
      };

    case "outputType":
      return {
        stepKey,
        stage: "OUTPUT_CLASSIFIED",
        title: "Choose the kind of move.",
        prompt:
          "Based on what is actually happening, what kind of next step fits?",
        placeholder: "",
        helperText:
          "Compass does not choose for you. It helps classify the move.",
        inputType: "choice",
        choices: [
          { label: "Act", value: "ACT" },
          { label: "Hold", value: "HOLD" },
          { label: "Observe", value: "OBSERVE" },
        ],
      };

    case "nextStep": {
      const prompt =
        answers.outputType === "ACT"
          ? "What action matches what is actually happening?"
          : answers.outputType === "HOLD"
            ? "What would holding steady look like here?"
            : answers.outputType === "OBSERVE"
              ? "What do you need to observe before acting?"
              : "What is the next step you already know you need to take?";

      return {
        stepKey,
        stage: "NEXT_STEP_CHOSEN",
        title: "Name the next step.",
        prompt,
        placeholder: "Write one clear move in your own words.",
        inputType: "textarea",
      };
    }
  }
}

function getLatestAnsweredValue(
  nextStep: FearStepKey,
  answers: FearAnswers
): string {
  switch (nextStep) {
    case "signal":
      return "";
    case "projection":
      return answers.signal;
    case "realityCheck":
      return answers.projection;
    case "presentReality":
      return answers.realityCheck;
    case "consideredAction":
      return answers.presentReality;
    case "actionAlignment":
      return answers.consideredAction;
    case "control":
      return answers.actionAlignment;
    case "outputType":
      return answers.control;
    case "nextStep":
      return answers.outputType;
  }
}

// ─────────────────────────────────────────────
// Main Fear Lens Engine
// ─────────────────────────────────────────────

export function runFearLens(answers: FearAnswers): FearLensOutput {
  const nextStep = getNextUnansweredStep(answers);

  if (!nextStep) {
    return {
      stage: "NEXT_STEP_CHOSEN",
      currentPrompt: null,
      isComplete: true,

      distortionType: "none",
      distortionCount: 0,
      interventionLevel: "none",

      regressionDetected: false,
      regressionReason: null,

      summary: {
        signal: answers.signal,
        projection: answers.projection,
        presentReality: answers.presentReality,
        consideredAction: answers.consideredAction,
        actionAlignment: answers.actionAlignment,
        control: answers.control,
        outputType: answers.outputType,
        nextStep: answers.nextStep,
      },
    };
  }

  const latestAnsweredValue = getLatestAnsweredValue(nextStep, answers);
  const distortion = detectDistortion(latestAnsweredValue);
  const interventionLevel = getInterventionLevel(distortion.distortionCount);

  const shouldCheckRegression =
    latestAnsweredValue.trim().length > 0 &&
    nextStep !== "projection" &&
    nextStep !== "realityCheck" &&
    nextStep !== "presentReality";

  if (
    shouldCheckRegression &&
    distortion.distortionType !== "none" &&
    interventionLevel !== "none"
  ) {
    return {
      stage: "REGRESSION_DETECTED",
      currentPrompt: buildRegressionPrompt(
        distortion.distortionType,
        interventionLevel
      ),
      isComplete: false,

      distortionType: distortion.distortionType,
      distortionCount: distortion.distortionCount,
      interventionLevel,

      regressionDetected: true,
      regressionReason: distortion.distortionType,

      summary: null,
    };
  }

  const prompt = buildPromptForStep(nextStep, answers);

  return {
    stage: prompt.stage,
    currentPrompt: prompt,
    isComplete: false,

    distortionType: distortion.distortionType,
    distortionCount: distortion.distortionCount,
    interventionLevel,

    regressionDetected: false,
    regressionReason: null,

    summary: null,
  };
}