import { runELPerception } from "@/src/lib/el/el-core";
import type {
  ELPerceptionOutput,
  ObservationType,
} from "@/src/lib/el/el-types";

export type RecognitionPerceptionInput = {
  questionKey: string;
  questionText: string;
  response: string;
};

export type RecognitionAnswerPerception = RecognitionPerceptionInput & {
  perception: ELPerceptionOutput;
};

export type RecurringLanguageSignal = {
  term: string;
  questionKeys: string[];
  answerCount: number;
};

export type RecurringObservationSignal = {
  type: ObservationType;
  questionKeys: string[];
  answerCount: number;
};

export type RecognitionPerceptionSummary = {
  answers: RecognitionAnswerPerception[];
  recurringLanguage: RecurringLanguageSignal[];
  recurringObservations: RecurringObservationSignal[];
};

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "been",
  "before",
  "being",
  "could",
  "does",
  "doing",
  "from",
  "have",
  "having",
  "into",
  "just",
  "like",
  "more",
  "most",
  "much",
  "only",
  "other",
  "really",
  "same",
  "something",
  "still",
  "than",
  "that",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "thing",
  "things",
  "this",
  "those",
  "through",
  "very",
  "want",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would",
  "your",
]);

export function buildRecognitionPerception(
  responses: RecognitionPerceptionInput[],
): RecognitionPerceptionSummary {
  const answers = responses.map((item) => ({
    ...item,
    perception: runELPerception({
      participantResponse: item.response,
    }),
  }));

  return {
    answers,
    recurringLanguage: findRecurringLanguage(responses),
    recurringObservations: findRecurringObservations(answers),
  };
}

function findRecurringLanguage(
  responses: RecognitionPerceptionInput[],
): RecurringLanguageSignal[] {
  const occurrenceMap = new Map<
    string,
    {
      questionKeys: Set<string>;
      totalCount: number;
    }
  >();

  for (const response of responses) {
    const terms = tokenize(response.response);

    for (const term of terms) {
      const current = occurrenceMap.get(term) ?? {
        questionKeys: new Set<string>(),
        totalCount: 0,
      };

      current.questionKeys.add(response.questionKey);
      current.totalCount += 1;
      occurrenceMap.set(term, current);
    }
  }

  return [...occurrenceMap.entries()]
    .filter(([, value]) => value.questionKeys.size >= 2)
    .sort(([, left], [, right]) => {
      if (right.questionKeys.size !== left.questionKeys.size) {
        return right.questionKeys.size - left.questionKeys.size;
      }

      return right.totalCount - left.totalCount;
    })
    .slice(0, 12)
    .map(([term, value]) => ({
      term,
      questionKeys: [...value.questionKeys],
      answerCount: value.questionKeys.size,
    }));
}

function findRecurringObservations(
  answers: RecognitionAnswerPerception[],
): RecurringObservationSignal[] {
  const observationMap = new Map<ObservationType, Set<string>>();

  for (const answer of answers) {
    const observationTypes = new Set(
      answer.perception.observations.map((observation) => observation.type),
    );

    for (const type of observationTypes) {
      const questionKeys = observationMap.get(type) ?? new Set<string>();
      questionKeys.add(answer.questionKey);
      observationMap.set(type, questionKeys);
    }
  }

  return [...observationMap.entries()]
    .filter(([, questionKeys]) => questionKeys.size >= 2)
    .sort(([, left], [, right]) => right.size - left.size)
    .map(([type, questionKeys]) => ({
      type,
      questionKeys: [...questionKeys],
      answerCount: questionKeys.size,
    }));
}

function tokenize(value: string): string[] {
  return (
    value
      .toLowerCase()
      .match(/[a-z0-9][a-z0-9'-]*/g) ?? []
  ).filter(
    (term) =>
      term.length >= 4 &&
      !STOP_WORDS.has(term) &&
      !/^\d+$/.test(term),
  );
}
