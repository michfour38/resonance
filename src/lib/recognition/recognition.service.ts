import { prisma } from "@/lib/prisma";
import { generateAI } from "@/src/lib/ai/ai-gateway";
import {
  buildRecognitionClarityMap,
  type RecognitionClarityContext,
  type RecognitionClarityMap,
} from "@/src/lib/recognition/recognition-clarity";
import {
  buildRecognitionPerception,
  type RecognitionPerceptionSummary,
} from "@/src/lib/recognition/recognition-perception";
import { RECOGNITION_QUESTIONS } from "@/src/lib/recognition/recognition.questions";

export type RecognitionType = "female" | "male" | "neutral";

export interface RecognitionOutputDTO {
  id: string;
  sessionId: string;
  output: string;
  questions: string[];
  themesDetected: string[];
  tensionsDetected: string[];
  createdAt: string;
}

export function getRecognitionQuestions(_entryType: RecognitionType) {
  return RECOGNITION_QUESTIONS;
}

type RecognitionPromptResponse = {
  questionKey: string;
  questionText: string;
  response: string;
};

function buildRecognitionPrompt(params: {
  firstName?: string | null;
  previousOutput?: string | null;
  regenerate?: boolean;
  responses: RecognitionPromptResponse[];
  perception: RecognitionPerceptionSummary;
  clarityMap: RecognitionClarityMap;
}) {
  const {
    firstName,
    previousOutput,
    regenerate,
    responses,
    perception,
    clarityMap,
  } = params;

  return `
You are Oremea Recognition.

You reflect from the participant's entry reflection answers only.

First name: ${firstName || "Unknown"}

${
  regenerate && previousOutput
    ? `
This is a second Recognition pass.

The participant has had a chance to revisit their answers and offer more honest or precise information.
Use the previous Recognition as context while allowing the newer answers to carry stronger current evidence.
Notice what became clearer, more specific, or better supported.
Keep the language human and continuous with the first reflection.

PREVIOUS RECOGNITION:
${previousOutput}
`
    : ""
}

PURPOSE:

Recognition reveals what the participant's own words already make available to see.

EVIDENCE BOUNDARY:

Build every recognition from:
- the participant's actual answers
- specific language they used
- distinctions they made
- values, choices, clarity, uncertainty, or movement supported by their answers
- patterns supported across multiple answers

Keep every observation proportionate to the available evidence.
Present interpretation as possibility when certainty is limited.
Preserve the participant's authority over their own meaning, identity, and choices.

A repeated word is a recurrence signal before it is a theme.
A repeated EL observation category is evidence structure before it is meaning.
A supported tension is a detectable pull rather than a complete account of everything present.
Cross-answer signals strengthen a recognition only when the surrounding answers support the same reading.

CLARITY PRINCIPLES:

The Recognition sequence itself provides participant-owned clarity data.
The answer to "What do you already know clearly now?" is the primary source for stated clarity.
The answer to "Where does that clarity become harder to hold?" describes conditions around holding clarity.
Those conditions can affect steadiness, expression, embodiment, or participation while the underlying clarity remains present.
Do not convert stated clarity into confusion simply because consequences, expectations, emotions, responsibilities, or other people also appear.
The answer to the distinction question shows what the participant can already separate into clearer parts.
The final recognition answer shows what became newly visible through the reflection.
Explicit uncertainty is present only where the participant's own language states uncertainty.
Clarity and uncertainty can both be present in different parts of the same reality.

VOICE:

- grounded
- precise
- human
- emotionally accurate
- restrained
- direct
- evidence-led
- spacious
- respectful of sovereignty

CORE RELATIONSHIP:

Write as though the participant has been genuinely heard.
Reflect what their words make visible while leaving ownership of meaning with them.

WHAT TO NOTICE:

- what the participant names directly
- what becomes more specific across their answers
- where their own words carry particular weight
- what they explicitly state as clear
- what they distinguish into clearer parts
- what conditions affect their ability to remain with that clarity
- what remains explicitly uncertain in their own language
- what becomes newly visible when their answers are considered together
- what matters enough to keep returning
- where language recurs across separate answers
- where evidence categories recur across separate answers
- where a recurring subject carries a coherent thread across several answers
- where a subject carries agency and friction in different answers
- where several truths, values, needs, choices, consequences, or constraints are present at the same time

STRUCTURE:

Use these exact quiet plain-text section labels:

What is becoming visible

What seems to matter

Where clarity already exists

What remains available to notice

SECTION RULES:

"What is becoming visible"
- Begin with the clearest recognition supported by the participant's answers.
- Ground it in specific evidence from their own words.
- Use proportionate language.
- Let cross-answer recurrence strengthen a recognition when the surrounding answers support the same reading.
- A supported tension may be named when the relevant truths are clearly present in the participant's own words.
- Treat newly visible material as emerging recognition rather than a fixed identity claim.

"What seems to matter"
- Notice what receives repeated attention, specificity, energy, choice, or care.
- A supported theme candidate can strengthen this section when its separate contexts form a coherent thread.
- Name a value or concern only when the answers support it.
- Keep ownership with the participant.

"Where clarity already exists"
- Begin with participant-stated clarity and distinctions when they are available.
- Treat existing clarity as capacity.
- Preserve clarity even when the clarity-holding answer names difficult conditions around it.
- More than one truth can sit beside the clarity without cancelling it.
- Keep clarity distinct from instruction.

"What remains available to notice"
- Use explicit uncertainty, newly visible material, unresolved complexity, or a supported tension as an opening when the evidence supports it.
- Leave one precise opening for further recognition.
- Keep the opening voluntary and grounded in what is already present.

MULTIPLE-TRUTH, TENSION, AND CONTRADICTION RULES:

More than one thing can be true at the same time.
A tension may contain several simultaneous truths, values, needs, choices, consequences, or constraints.
Preserve the full set that the participant's answers support rather than reducing the tension to two sides.
An agency/friction candidate below identifies one detectable pull around a subject; it is not the complete shape of that subject.
Use language such as "several things appear to be present at once" or "there appears to be a pull around..." when the evidence supports it.
Reserve the word contradiction for explicit participant statements that cannot reasonably both be true in the same sense at the same time.

PARTICIPANT-OWNED CLARITY MAP:

${renderClarityMap(clarityMap)}

SUPPORTED THEME CANDIDATES:

These candidates are mechanically grounded in literal language appearing across at least three separate answers.
The recurrence threshold establishes sustained attention, not meaning by itself.
A candidate becomes useful as a theme only when its answer contexts carry a coherent thread.
Names, ordinary connective language, or repeated circumstance words can remain simple recurrence rather than becoming themes.

${renderSupportedThemes(perception)}

SUPPORTED CROSS-ANSWER TENSIONS:

These candidates are mechanically grounded where the same literal subject appears inside agency evidence in one answer and objection evidence in another answer.
Each candidate establishes one supported pull around that subject.
The participant's other answers may contain additional truths around the same subject and remain part of the recognition.

${renderSupportedTensions(perception)}

CROSS-ANSWER LITERAL LANGUAGE:

These terms appear literally in more than one answer.
Treat them as recurrence signals and read their full contexts before assigning significance.

${renderRecurringLanguage(perception)}

CROSS-ANSWER EL OBSERVATIONS:

These EL categories recur across more than one answer.
They describe evidence structure rather than identity, motive, diagnosis, or meaning.

${renderRecurringObservations(perception)}

EL EVIDENCE BY ANSWER:

This evidence was extracted mechanically from participant answers.
Use it as supporting signal while keeping the full answers primary.

${renderEvidenceByAnswer(perception)}

EL SUPPORTING OBSERVATIONS BY ANSWER:

These observations are derived from the evidence above and provide supporting structure.
The participant's own words remain authoritative.

${renderObservationsByAnswer(perception)}

USER RESPONSES:

${renderResponses(responses)}
`;
}

function renderClarityMap(clarityMap: RecognitionClarityMap) {
  const statedClarity = renderClarityContexts(
    clarityMap.statedClarity,
    "Participant-stated clarity is still forming or was expressed with explicit uncertainty.",
  );

  const distinctions = renderClarityContexts(
    clarityMap.distinctions,
    "The participant did not provide a separate distinction response.",
  );

  const clarityConditions = renderClarityContexts(
    clarityMap.clarityConditions,
    "The participant did not name separate conditions around holding clarity.",
  );

  const newlyVisible = renderClarityContexts(
    clarityMap.newlyVisible,
    "The participant did not provide a separate newly-visible response.",
  );

  const explicitUncertainty =
    clarityMap.explicitUncertainty.length > 0
      ? clarityMap.explicitUncertainty
          .map(
            (item) =>
              `- [${item.questionKey}] ${item.content} [markers: ${item.markers.join(", ")}]`,
          )
          .join("\n")
      : "- No explicit uncertainty language detected.";

  const clarityAlongsideTension =
    clarityMap.clarityAlongsideTension.length > 0
      ? clarityMap.clarityAlongsideTension
          .map(
            (item) => `
- Supported pull around "${item.term}" also appears inside clarity-related material:
${item.contexts
  .map((context) => `  - [${context.questionKey}] ${context.content}`)
  .join("\n")}`,
          )
          .join("\n")
      : "- No supported tension term overlaps the clarity-related answers.";

  return `
Stated clarity:
${statedClarity}

Distinctions already available:
${distinctions}

Conditions around holding clarity:
${clarityConditions}

Newly visible through the reflection:
${newlyVisible}

Explicit uncertainty:
${explicitUncertainty}

Clarity alongside supported complexity:
${clarityAlongsideTension}
`;
}

function renderClarityContexts(
  contexts: RecognitionClarityContext[],
  emptyMessage: string,
) {
  if (contexts.length === 0) return `- ${emptyMessage}`;

  return contexts
    .map((context) => {
      const evidenceLabel =
        context.evidenceTypes.length > 0
          ? ` [EL: ${context.evidenceTypes.join(", ")}]`
          : "";

      return `- [${context.questionKey}]${evidenceLabel} ${context.content}`;
    })
    .join("\n");
}

function renderSupportedThemes(perception: RecognitionPerceptionSummary) {
  if (perception.supportedThemes.length === 0) {
    return "- No supported theme candidate reached the recurrence threshold.";
  }

  return perception.supportedThemes
    .map(
      (theme) => `
Possible theme around "${theme.term}" across ${theme.answerCount} answers:
${theme.contexts
  .map((context) => {
    const evidenceLabel =
      context.evidenceTypes.length > 0
        ? ` [EL: ${context.evidenceTypes.join(", ")}]`
        : "";

    return `- [${context.questionKey}]${evidenceLabel} ${context.content}`;
  })
  .join("\n")}
`,
    )
    .join("\n");
}

function renderSupportedTensions(perception: RecognitionPerceptionSummary) {
  if (perception.supportedTensions.length === 0) {
    return "- No supported cross-answer tension detected.";
  }

  return perception.supportedTensions
    .map(
      (item) => `
Possible pull around "${item.term}":
Agency evidence:
${item.agencyEvidence
  .map(
    (evidence) =>
      `- [${evidence.questionKey}] ${evidence.type}: ${evidence.content}`,
  )
  .join("\n")}
Friction evidence:
${item.frictionEvidence
  .map(
    (evidence) =>
      `- [${evidence.questionKey}] ${evidence.type}: ${evidence.content}`,
  )
  .join("\n")}
`,
    )
    .join("\n");
}

function renderRecurringLanguage(perception: RecognitionPerceptionSummary) {
  if (perception.recurringLanguage.length === 0) {
    return "- No qualifying literal recurrence detected.";
  }

  return perception.recurringLanguage
    .map(
      (item) =>
        `- "${item.term}" appears across ${item.answerCount} answers: ${item.questionKeys.join(", ")}`,
    )
    .join("\n");
}

function renderRecurringObservations(perception: RecognitionPerceptionSummary) {
  if (perception.recurringObservations.length === 0) {
    return "- No recurring EL observation categories detected.";
  }

  return perception.recurringObservations
    .map(
      (item) =>
        `- ${item.type} appears across ${item.answerCount} answers: ${item.questionKeys.join(", ")}`,
    )
    .join("\n");
}

function renderEvidenceByAnswer(perception: RecognitionPerceptionSummary) {
  return perception.answers
    .map((answer, index) => {
      const evidence =
        answer.perception.evidence.length > 0
          ? answer.perception.evidence
              .map(
                (item) =>
                  `- ${item.type}: ${item.content} (${item.confidence})`,
              )
              .join("\n")
          : "- No EL evidence extracted.";

      return `Answer ${index + 1} [${answer.questionKey}] evidence:\n${evidence}`;
    })
    .join("\n\n");
}

function renderObservationsByAnswer(perception: RecognitionPerceptionSummary) {
  return perception.answers
    .map((answer, index) => {
      const observations =
        answer.perception.observations.length > 0
          ? answer.perception.observations
              .map(
                (item) =>
                  `- ${item.type}: ${item.summary} (${item.confidence})`,
              )
              .join("\n")
          : "- No EL observations created.";

      return `Answer ${index + 1} [${answer.questionKey}] observations:\n${observations}`;
    })
    .join("\n\n");
}

function renderResponses(responses: RecognitionPromptResponse[]) {
  return responses
    .map(
      (item, index) =>
        `Question ${index + 1} [${item.questionKey}]: ${item.questionText}\nAnswer ${index + 1}: ${item.response}`,
    )
    .join("\n\n");
}

function extractQuestionsFromOutput(output: string) {
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.endsWith("?"))
    .slice(-2);
}

export async function generateRecognition(params: {
  sessionId: string;
  regenerate?: boolean;
}): Promise<RecognitionOutputDTO | null> {
  const session = await prisma.entry_mirror_sessions.findUnique({
    where: { id: params.sessionId },
    select: {
      id: true,
      entry_type: true,
      lead_id: true,
      entry_leads: {
        select: {
          first_name: true,
          email: true,
        },
      },
      entry_mirror_responses: {
        orderBy: { response_order: "asc" },
        select: {
          question_key: true,
          question_text: true,
          response: true,
        },
      },
      entry_mirror_outputs: {
        orderBy: { created_at: "asc" },
        take: 2,
        select: {
          id: true,
          session_id: true,
          output: true,
          questions: true,
          themes_detected: true,
          tensions_detected: true,
          created_at: true,
        },
      },
    },
  });

  if (!session) return null;

  const outputs = session.entry_mirror_outputs;
  const latest = outputs[outputs.length - 1] ?? null;
  const firstOutput = outputs[0] ?? null;

  if (!params.regenerate && latest) {
    return mapRecognitionOutput(latest);
  }

  if (params.regenerate && outputs.length >= 2) {
    return latest ? mapRecognitionOutput(latest) : null;
  }

  const cleanResponses = session.entry_mirror_responses
    .map((item) => ({
      questionKey: item.question_key.trim(),
      questionText: item.question_text.trim(),
      response: item.response.trim(),
    }))
    .filter(
      (item) =>
        item.questionKey.length > 0 &&
        item.questionText.length > 0 &&
        item.response.length > 0,
    );

  if (cleanResponses.length < 8) {
    console.error("Recognition requires at least 8 completed responses.");
    return null;
  }

  const entryType = ["female", "male", "neutral"].includes(session.entry_type)
    ? (session.entry_type as RecognitionType)
    : "neutral";

  const perception = buildRecognitionPerception(cleanResponses);
  const clarityMap = buildRecognitionClarityMap(
    perception.answers.map((answer) => ({
      questionKey: answer.questionKey,
      response: answer.response,
      evidenceTypes: [
        ...new Set(answer.perception.evidence.map((evidence) => evidence.type)),
      ],
    })),
    perception.supportedTensions.map((item) => item.term),
  );

  const prompt = buildRecognitionPrompt({
    firstName: session.entry_leads.first_name,
    previousOutput: firstOutput?.output ?? null,
    regenerate: Boolean(params.regenerate),
    responses: cleanResponses,
    perception,
    clarityMap,
  });

  const output = await generateAI({
    task: "recognition_synthesis",
    prompt,
    maxTokens: 1400,
  });

  if (!output) return null;

  const questions = extractQuestionsFromOutput(output);
  const themesDetected = perception.supportedThemes.map((item) => item.term);
  const tensionsDetected = perception.supportedTensions.map((item) => item.term);

  const saved = await prisma.entry_mirror_outputs.create({
    data: {
      session_id: session.id,
      output,
      questions,
      themes_detected: themesDetected,
      tensions_detected: tensionsDetected,
      input_snapshot: {
        entryType,
        leadId: session.lead_id,
        responseCount: cleanResponses.length,
        questionKeys: cleanResponses.map((item) => item.questionKey),
        questionTexts: cleanResponses.map((item) => item.questionText),
        recurringLanguage: perception.recurringLanguage,
        recurringObservations: perception.recurringObservations,
        supportedThemes: perception.supportedThemes,
        supportedTensions: perception.supportedTensions,
        clarityMap,
      },
    },
    select: {
      id: true,
      session_id: true,
      output: true,
      questions: true,
      themes_detected: true,
      tensions_detected: true,
      created_at: true,
    },
  });

  await prisma.entry_mirror_sessions.update({
    where: { id: session.id },
    data: {
      status: "completed",
      completed_at: new Date(),
      mirror_generated_at: new Date(),
    },
  });

  return mapRecognitionOutput(saved);
}

function mapRecognitionOutput(output: {
  id: string;
  session_id: string;
  output: string;
  questions: string[];
  themes_detected: string[];
  tensions_detected: string[];
  created_at: Date;
}): RecognitionOutputDTO {
  return {
    id: output.id,
    sessionId: output.session_id,
    output: output.output,
    questions: output.questions,
    themesDetected: output.themes_detected,
    tensionsDetected: output.tensions_detected,
    createdAt: output.created_at.toISOString(),
  };
}
