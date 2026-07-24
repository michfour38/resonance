import {
  buildRecognitionLanguageNormalization,
  type RecognitionLanguageCorrection,
  type RecognitionLanguageNormalization,
} from "@/src/lib/recognition/recognition-language";
import {
  buildRecognitionPerception,
  type RecognitionAnswerPerception,
  type RecognitionPerceptionInput,
  type RecognitionPerceptionSummary,
  type RecognitionTensionEvidence,
} from "@/src/lib/recognition/recognition-perception";

export type RecognitionTolerantAnswerPerception = RecognitionAnswerPerception & {
  normalizedResponse: string;
  languageCorrections: RecognitionLanguageCorrection[];
};

export type RecognitionTolerantPerceptionSummary = Omit<
  RecognitionPerceptionSummary,
  "answers"
> & {
  answers: RecognitionTolerantAnswerPerception[];
  languageNormalization: RecognitionLanguageNormalization;
};

export function buildRecognitionTolerantPerception(
  responses: RecognitionPerceptionInput[],
): RecognitionTolerantPerceptionSummary {
  const languageNormalization = buildRecognitionLanguageNormalization(
    responses.map((item) => ({
      questionKey: item.questionKey,
      response: item.response,
    })),
  );

  const normalizedInputs = responses.map((item) => {
    const normalized = languageNormalization.answers.find(
      (answer) => answer.questionKey === item.questionKey,
    );

    return {
      ...item,
      response: normalized?.normalizedResponse ?? item.response,
    };
  });

  const base = buildRecognitionPerception(normalizedInputs);

  const answers: RecognitionTolerantAnswerPerception[] = base.answers.map(
    (answer) => {
      const raw = responses.find(
        (item) => item.questionKey === answer.questionKey,
      );
      const normalized = languageNormalization.answers.find(
        (item) => item.questionKey === answer.questionKey,
      );

      return {
        ...answer,
        questionText: raw?.questionText ?? answer.questionText,
        response: raw?.response ?? answer.response,
        normalizedResponse: normalized?.normalizedResponse ?? answer.response,
        languageCorrections: normalized?.corrections ?? [],
      };
    },
  );

  return {
    ...base,
    answers,
    supportedThemes: base.supportedThemes.map((theme) => ({
      ...theme,
      contexts: theme.contexts.map((context) => {
        const answer = answers.find(
          (item) => item.questionKey === context.questionKey,
        );

        return {
          ...context,
          content: answer
            ? extractRawTermContext(
                answer.response,
                answer.normalizedResponse,
                theme.term,
              )
            : context.content,
        };
      }),
    })),
    supportedTensions: base.supportedTensions.map((tension) => ({
      ...tension,
      agencyEvidence: remapTensionEvidence(
        tension.agencyEvidence,
        tension.term,
        answers,
      ),
      frictionEvidence: remapTensionEvidence(
        tension.frictionEvidence,
        tension.term,
        answers,
      ),
    })),
    languageNormalization,
  };
}

function remapTensionEvidence(
  evidence: RecognitionTensionEvidence[],
  term: string,
  answers: RecognitionTolerantAnswerPerception[],
): RecognitionTensionEvidence[] {
  return evidence.map((item) => {
    const answer = answers.find(
      (candidate) => candidate.questionKey === item.questionKey,
    );

    if (!answer) return item;

    return {
      ...item,
      content: extractRawTermContext(
        answer.response,
        answer.normalizedResponse,
        term,
      ),
    };
  });
}

function extractRawTermContext(
  rawResponse: string,
  normalizedResponse: string,
  term: string,
): string {
  const rawSentences = splitSentences(rawResponse);
  const normalizedSentences = splitSentences(normalizedResponse);

  const matchingIndex = normalizedSentences.findIndex((sentence) =>
    containsLiteralTerm(sentence, term),
  );

  if (matchingIndex >= 0) {
    return rawSentences[matchingIndex] ?? normalizedSentences[matchingIndex];
  }

  return rawResponse.trim();
}

function splitSentences(value: string): string[] {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function containsLiteralTerm(content: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(content);
}
