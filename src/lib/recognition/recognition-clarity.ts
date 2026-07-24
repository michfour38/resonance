import type { EvidenceType } from "@/src/lib/el/el-types";

export type RecognitionClarityInput = {
  questionKey: string;
  response: string;
  evidenceTypes: EvidenceType[];
};

export type RecognitionClarityContext = {
  questionKey: string;
  content: string;
  evidenceTypes: EvidenceType[];
};

export type RecognitionUncertaintyContext = RecognitionClarityContext & {
  markers: string[];
};

export type RecognitionClarityAlongsideTension = {
  term: string;
  contexts: RecognitionClarityContext[];
};

export type RecognitionClarityMap = {
  statedClarity: RecognitionClarityContext[];
  distinctions: RecognitionClarityContext[];
  clarityConditions: RecognitionClarityContext[];
  newlyVisible: RecognitionClarityContext[];
  explicitUncertainty: RecognitionUncertaintyContext[];
  clarityAlongsideTension: RecognitionClarityAlongsideTension[];
};

const UNCERTAINTY_MARKERS = [
  "i don't know",
  "i dont know",
  "i do not know",
  "not sure",
  "unsure",
  "maybe",
  "perhaps",
  "i guess",
  "i'm uncertain",
  "i am uncertain",
];

export function buildRecognitionClarityMap(
  inputs: RecognitionClarityInput[],
  supportedTensionTerms: string[],
): RecognitionClarityMap {
  const clarityInput = inputs.find((item) => item.questionKey === "clarity");

  const statedClarity = clarityInput
    ? buildStatedClarity(clarityInput)
    : [];

  const distinctions = buildQuestionContexts(inputs, "distinction");
  const clarityConditions = buildQuestionContexts(inputs, "clarity_holding");
  const newlyVisible = buildQuestionContexts(inputs, "recognition");
  const explicitUncertainty = findExplicitUncertainty(inputs);

  return {
    statedClarity,
    distinctions,
    clarityConditions,
    newlyVisible,
    explicitUncertainty,
    clarityAlongsideTension: findClarityAlongsideTension({
      statedClarity,
      clarityConditions,
      newlyVisible,
      supportedTensionTerms,
    }),
  };
}

function buildStatedClarity(
  input: RecognitionClarityInput,
): RecognitionClarityContext[] {
  const sentences = splitSentences(input.response);
  const clearSentences = sentences.filter(
    (sentence) => findUncertaintyMarkers(sentence).length === 0,
  );

  if (clearSentences.length === 0) {
    return [];
  }

  return [
    {
      questionKey: input.questionKey,
      content: clearSentences.join(" "),
      evidenceTypes: input.evidenceTypes,
    },
  ];
}

function buildQuestionContexts(
  inputs: RecognitionClarityInput[],
  questionKey: string,
): RecognitionClarityContext[] {
  return inputs
    .filter((item) => item.questionKey === questionKey && item.response.trim())
    .map((item) => ({
      questionKey: item.questionKey,
      content: item.response.trim(),
      evidenceTypes: item.evidenceTypes,
    }));
}

function findExplicitUncertainty(
  inputs: RecognitionClarityInput[],
): RecognitionUncertaintyContext[] {
  const contexts: RecognitionUncertaintyContext[] = [];

  for (const input of inputs) {
    for (const sentence of splitSentences(input.response)) {
      const markers = findUncertaintyMarkers(sentence);

      if (markers.length === 0) continue;

      contexts.push({
        questionKey: input.questionKey,
        content: sentence,
        evidenceTypes: input.evidenceTypes,
        markers,
      });
    }
  }

  return contexts.slice(0, 10);
}

function findClarityAlongsideTension({
  statedClarity,
  clarityConditions,
  newlyVisible,
  supportedTensionTerms,
}: {
  statedClarity: RecognitionClarityContext[];
  clarityConditions: RecognitionClarityContext[];
  newlyVisible: RecognitionClarityContext[];
  supportedTensionTerms: string[];
}): RecognitionClarityAlongsideTension[] {
  const clarityContexts = [
    ...statedClarity,
    ...clarityConditions,
    ...newlyVisible,
  ];

  return supportedTensionTerms
    .map((term) => ({
      term,
      contexts: clarityContexts.filter((context) =>
        containsLiteralTerm(context.content, term),
      ),
    }))
    .filter((item) => item.contexts.length > 0)
    .slice(0, 6);
}

function findUncertaintyMarkers(value: string): string[] {
  const normalized = value.toLowerCase();

  return UNCERTAINTY_MARKERS.filter((marker) => normalized.includes(marker));
}

function splitSentences(value: string): string[] {
  const normalized = value.trim().replace(/\s+/g, " ");

  if (!normalized) return [];

  return normalized
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function containsLiteralTerm(content: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}\\b`, "i");

  return pattern.test(content);
}
