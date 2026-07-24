import { generateAI } from "@/src/lib/ai/ai-gateway";
import { prisma } from "@/lib/prisma";
import { RECOGNITION_QUESTIONS } from "@/src/lib/recognition/recognition.questions";
import { runELPerception } from "@/src/lib/el/el-core";

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

function buildRecognitionPrompt(params: {
  firstName?: string | null;
  previousOutput?: string | null;
  regenerate?: boolean;
  responses: {
    questionText: string;
    response: string;
  }[];
  perceptions: ReturnType<typeof runELPerception>[];
}) {
  const {
  firstName,
  previousOutput,
  regenerate,
  responses,
  perceptions,
} = params;

  return `
You are Oremea Recognition.

You reflect from the user's entry reflection answers only.

First name: ${firstName || "Unknown"}

${
  regenerate && previousOutput
    ? `

This is a second Recognition pass.

The user has had a chance to revisit their answers and offer more honest or precise information.

Use the previous Recognition as context.

Do not frame the earlier Recognition as wrong.
Do not say "updated analysis."
Do not sound like software.
Do not mention regeneration mechanics.

Notice what became clearer, more specific, or better supported through the additional answers.

Use the new answers as stronger current evidence.

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

Keep every observation proportionate to the available evidence.

Treat interpretations as possibilities when certainty is limited.

Preserve the participant's authority over their own meaning, identity, and choices.

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
- what they already appear to know
- where clarity is present
- where clarity becomes less stable
- what matters enough to keep returning
- what becomes newly visible when their answers are considered together

STRUCTURE:

Use quiet plain-text section labels only.

Use these exact plain-text section labels:

What is becoming visible

What seems to matter

Where clarity already exists

What remains available to notice

SECTION RULES:

"What is becoming visible"
- Begin with the clearest recognition supported by the participant's answers.
- Ground it in specific evidence from their own words.
- Use proportionate language.
- Reveal rather than interpret beyond the evidence.

"What seems to matter"
- Notice what receives repeated attention, specificity, energy, choice, or care.
- Name the value or concern only when the answers support it.
- Keep ownership with the participant.

"Where clarity already exists"
- Surface what the participant already appears to know, recognise, prefer, or distinguish.
- Treat existing clarity as capacity.
- Do not turn clarity into an instruction.

"What remains available to notice"
- Leave one precise opening for further recognition.
- Point toward something their existing answers make available to examine.
- Keep the opening voluntary.
- Do not prescribe an action.
- Do not manufacture a problem that has not appeared.

EL EVIDENCE:

The following evidence was extracted mechanically from the participant's answers.

Use it as supporting signal only.

The participant's full answers remain the primary source of truth.

${perceptions
  .map(
    (perception, index) => `
Answer ${index + 1} evidence:
${perception.evidence
  .map(
    (item) =>
      `- ${item.type}: ${item.content} (${item.confidence})`
  )
  .join("\n")}
`
  )
  .join("\n")}

EL SUPPORTING OBSERVATIONS:

These observations are derived from the evidence above.

Use them as supporting structure only.
Keep the participant's own words authoritative.

${perceptions
  .map(
    (perception, index) => `
Answer ${index + 1} observations:
${perception.observations
  .map(
    (item) =>
      `- ${item.type}: ${item.summary} (${item.confidence})`
  )
  .join("\n")}
`
  )
  .join("\n")}

USER RESPONSES:

${responses
  .map(
    (item, index) => `
Question ${index + 1}: ${item.questionText}
Answer ${index + 1}: ${item.response}
`
  )
  .join("\n")}
`;
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
    return {
      id: latest.id,
      sessionId: latest.session_id,
      output: latest.output,
      questions: latest.questions,
      themesDetected: latest.themes_detected,
      tensionsDetected: latest.tensions_detected,
      createdAt: latest.created_at.toISOString(),
    };
  }

  if (params.regenerate && outputs.length >= 2) {
    return latest
      ? {
          id: latest.id,
          sessionId: latest.session_id,
          output: latest.output,
          questions: latest.questions,
          themesDetected: latest.themes_detected,
          tensionsDetected: latest.tensions_detected,
          createdAt: latest.created_at.toISOString(),
        }
      : null;
  }

  const cleanResponses = session.entry_mirror_responses
    .map((item) => ({
      questionText: item.question_text.trim(),
      response: item.response.trim(),
    }))
    .filter((item) => item.questionText.length > 0 && item.response.length > 0);

  if (cleanResponses.length < 8) {
    console.error("Recognition requires at least 8 completed responses.");
    return null;
  }

  const entryType = ["female", "male", "neutral"].includes(session.entry_type)
    ? (session.entry_type as RecognitionType)
    : "neutral";

const perceptions = cleanResponses.map((item) =>
  runELPerception({
    participantResponse: item.response,
  })
);

    const prompt = buildRecognitionPrompt({
  firstName: session.entry_leads.first_name,
  previousOutput: firstOutput?.output ?? null,
  regenerate: Boolean(params.regenerate),
  responses: cleanResponses,
  perceptions,
});

  const output = await generateAI({
  task: "recognition_synthesis",
  prompt,
  maxTokens: 1400,
});

  if (!output) return null;

  const questions = extractQuestionsFromOutput(output);

  const saved = await prisma.entry_mirror_outputs.create({
    data: {
      session_id: session.id,
      output,
      questions,
      themes_detected: [],
      tensions_detected: [],
      input_snapshot: {
        entryType,
        leadId: session.lead_id,
        responseCount: cleanResponses.length,
        questionTexts: cleanResponses.map((item) => item.questionText),
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

  return {
    id: saved.id,
    sessionId: saved.session_id,
    output: saved.output,
    questions: saved.questions,
    themesDetected: saved.themes_detected,
    tensionsDetected: saved.tensions_detected,
    createdAt: saved.created_at.toISOString(),
  };
}