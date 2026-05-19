"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import {
  COMPASS_AREA_QUESTIONS,
  analyzeAreaResponse,
  buildAdaptiveRecursiveQuestion,
  buildAreaMirrorReflection,
  calibrateExecutionStep,
  createRecursiveLayer,
  evaluateResonanceBridge,
  generateNextStep,
  getRecursiveQuestion,
  mapResistance,
  reflectCoreValues,
  reflectPrimaryArea,
  type CompassAreaResponse,
  type CompassGoalArea,
  type CompassRecursiveLayer,
  type CompassResistanceMap,
} from "@/src/lib/compass/session";

type CompassPhase =
  | "intro"
  | "area"
  | "analyzing"
  | "area_mirror"
  | "area_confirmation"
  | "depth_intro"
  | "depth"
  | "core_reflection"
  | "resistance"
  | "discussion"
  | "execution_check"
  | "complete";

const AREA_LABELS: Record<CompassGoalArea, string> = {
  relationships: "Relationships",
  income: "Income",
  health: "Health",
  spirituality: "Spirituality",
  investments: "Investments",
  network: "Network",
  knowledge: "Knowledge",
  lifestyle: "Lifestyle",
};

const BODY_TEXT = "text-zinc-400";

export default function CompassPage() {
  const [phase, setPhase] = useState<CompassPhase>("intro");
  const [areaIndex, setAreaIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [discussionAnswer, setDiscussionAnswer] = useState("");
  const [areaResponses, setAreaResponses] = useState<CompassAreaResponse[]>([]);
  const [selectedArea, setSelectedArea] = useState<CompassGoalArea | null>(null);
  const [recursiveLayers, setRecursiveLayers] = useState<CompassRecursiveLayer[]>([]);
  const [recursiveAnswer, setRecursiveAnswer] = useState("");
  const [extraReflection, setExtraReflection] = useState("");
  const [resistanceAnswer, setResistanceAnswer] = useState("");
  const [resistanceMap, setResistanceMap] = useState<CompassResistanceMap | null>(null);
  const [proposedStep, setProposedStep] = useState("");
  const [executionFeeling, setExecutionFeeling] = useState("");
  const [finalStep, setFinalStep] = useState("");

  const currentArea = COMPASS_AREA_QUESTIONS[areaIndex];

  const areaMirror = useMemo(
    () => buildAreaMirrorReflection(areaResponses),
    [areaResponses],
  );

  const primaryReflection = useMemo(
    () => reflectPrimaryArea(areaResponses),
    [areaResponses],
  );

  const coreReflection = useMemo(
    () => reflectCoreValues(recursiveLayers),
    [recursiveLayers],
  );

  const resonanceBridge = useMemo(
    () => evaluateResonanceBridge(areaResponses),
    [areaResponses],
  );

  const selectedAreaLabel = selectedArea
    ? AREA_LABELS[selectedArea]
    : "your chosen goal";

  function pauseThen(next: () => void) {
    setPhase("analyzing");
    window.setTimeout(next, 1800);
  }

  function submitAreaAnswer() {
    if (!currentArea || !answer.trim()) return;

    const analyzed = analyzeAreaResponse({
      area: currentArea.area,
      answer,
    });

    setAreaResponses((current) => [...current, analyzed]);
    setAnswer("");

    if (areaIndex < COMPASS_AREA_QUESTIONS.length - 1) {
      pauseThen(() => {
        setAreaIndex((current) => current + 1);
        setPhase("area");
      });
      return;
    }

    pauseThen(() => setPhase("area_mirror"));
  }

  function chooseArea(area: CompassGoalArea) {
    setSelectedArea(area);
    pauseThen(() => setPhase("depth_intro"));
  }

  function submitRecursiveAnswer() {
    if (!recursiveAnswer.trim()) return;

    const layerNumber = recursiveLayers.length + 1;

    const question = buildAdaptiveRecursiveQuestion({
      layer: layerNumber,
      selectedAreaLabel,
      previousAnswer: recursiveLayers[recursiveLayers.length - 1]?.answer ?? "",
      firstAnswer:
        areaResponses.find((response) => response.area === selectedArea)?.answer ??
        "",
    });

    const fallbackQuestion = getRecursiveQuestion(layerNumber);

    const layer = createRecursiveLayer({
      layer: layerNumber,
      question: question || fallbackQuestion,
      answer: recursiveAnswer,
    });

    const updated = [...recursiveLayers, layer];

    setRecursiveLayers(updated);
    setRecursiveAnswer("");

    if (updated.length < 7) {
      pauseThen(() => setPhase("depth"));
      return;
    }

    pauseThen(() => setPhase("core_reflection"));
  }

  function submitResistance() {
    if (!resistanceAnswer.trim()) return;

    const mapped = mapResistance({ answer: resistanceAnswer });
    setResistanceMap(mapped);

    const step = generateNextStep({
      goal: selectedAreaLabel,
      resistance: mapped,
      execution: null,
    });

    setProposedStep(step);
    pauseThen(() => setPhase("discussion"));
  }

  function submitDiscussion() {
    if (!discussionAnswer.trim()) return;
    pauseThen(() => setPhase("execution_check"));
  }

  function submitExecutionFeeling() {
    if (!executionFeeling.trim()) return;

    const calibrated = calibrateExecutionStep({
      proposedStep,
      participantResponse: executionFeeling,
    });

    setFinalStep(
      calibrated.isStepExecutable
        ? proposedStep
        : calibrated.recalibratedStep ?? proposedStep,
    );

    pauseThen(() => setPhase("complete"));
  }

  return (
    <main className="min-h-screen bg-[#090909] text-stone-100">
      <section className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,134,64,0.08),_transparent_28%),linear-gradient(180deg,_rgba(16,16,16,0.96),_rgba(9,9,9,1))]" />

        <div className="relative mx-auto max-w-3xl">
          <header className="mb-5 pt-1 text-center">
            <div className="mx-auto mb-2 flex justify-center">
              <Image
                src="/images/compass-logo.webp"
                alt="The Compass by Oremea"
                width={640}
                height={180}
                priority
                className="h-auto w-[380px] sm:w-[560px]"
              />
            </div>

            <p className={`mx-auto max-w-2xl text-base leading-relaxed ${BODY_TEXT} sm:text-lg`}>
              Compass helps you discover what matters most to you, understand why
              it matters, identify what interrupts it, and build momentum through
              aligned execution.
            </p>

            <p className="mt-5 text-sm uppercase tracking-[0.34em] text-[#d8b15f]">
              Embodied momentum matters more than fantasy intensity.
            </p>
          </header>

          {phase === "intro" && (
            <CompassCard
              title="Begin Compass"
              description="You will move through eight recognizable life areas, one question at a time."
            >
              <p className={`text-sm leading-relaxed ${BODY_TEXT}`}>
                Compass may notice emotional weighting, repeating language,
                contradictions, resistance patterns, or recurring values in your
                responses.
              </p>

              <p className={`text-sm leading-relaxed ${BODY_TEXT}`}>
                Compass will never decide for you.
              </p>

              <p className={`text-sm leading-relaxed ${BODY_TEXT}`}>
                Later, Compass will take you at least seven layers deeper into
                the goal you choose.
              </p>

              <button onClick={() => setPhase("area")} className="primary-button">
                Begin
              </button>
            </CompassCard>
          )}

          {phase === "analyzing" && (
            <CompassCard
              title="Compass is analyzing your responses"
              description="Please wait while Compass reflects on your language patterns."
            >
              <div className={`flex justify-center py-8 text-5xl ${BODY_TEXT}`}>
                ...
              </div>
            </CompassCard>
          )}

          {phase === "area" && currentArea && (
            <CompassCard
              eyebrow={`${areaIndex + 1} of ${COMPASS_AREA_QUESTIONS.length}`}
              title={currentArea.title}
              description={currentArea.question}
            >
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder={currentArea.placeholder}
                rows={7}
                className="compass-textarea"
              />

              <p className={`text-xs leading-relaxed ${BODY_TEXT}`}>
                Your answers do not need to match the examples above. Those are
                only there to help if you feel stuck. The more you open up, the
                more direction you might find.
              </p>

              <button onClick={submitAreaAnswer} className="primary-button">
                Continue
              </button>
            </CompassCard>
          )}

          {phase === "area_mirror" && (
            <CompassCard
              title="Compass reflection"
              description={areaMirror.reflection}
            >
              <details className="rounded-2xl border border-zinc-800 bg-[#131313] p-4">
                <summary className={`cursor-pointer text-sm ${BODY_TEXT}`}>
                  Review your eight answers
                </summary>

                <div className="mt-4 space-y-4">
                  {areaResponses.map((response) => (
                    <div
                      key={response.area}
                      className="rounded-xl border border-zinc-800 p-4"
                    >
                      <p className="text-sm font-medium text-[#d8b15f]">
                        {AREA_LABELS[response.area]}
                      </p>

                      <p className={`mt-2 whitespace-pre-line text-sm ${BODY_TEXT}`}>
                        {response.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </details>

              <p className={`text-sm leading-relaxed ${BODY_TEXT}`}>
                If anything feels misunderstood, you can use that awareness when
                choosing your priority on the next page.
              </p>

              <button
                onClick={() => pauseThen(() => setPhase("area_confirmation"))}
                className="primary-button"
              >
                Continue
              </button>
            </CompassCard>
          )}

          {phase === "area_confirmation" && (
            <CompassCard
              title="What feels most important right now?"
              description={primaryReflection.reflection}
            >
              <details className="rounded-2xl border border-zinc-800 bg-[#131313] p-4">
                <summary className={`cursor-pointer text-sm ${BODY_TEXT}`}>
                  Review your answers
                </summary>

                <div className="mt-4 space-y-4">
                  {areaResponses.map((response) => (
                    <div
                      key={response.area}
                      className="rounded-xl border border-zinc-800 p-4"
                    >
                      <p className="text-sm font-medium text-[#d8b15f]">
                        {AREA_LABELS[response.area]}
                      </p>

                      <p className={`mt-2 whitespace-pre-line text-sm ${BODY_TEXT}`}>
                        {response.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </details>

              <div className="grid gap-3 sm:grid-cols-2">
                {COMPASS_AREA_QUESTIONS.map((item) => (
                  <button
                    key={item.area}
                    onClick={() => chooseArea(item.area)}
                    className="selection-button"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </CompassCard>
          )}

          {phase === "depth_intro" && (
            <CompassCard
              title="Great, now we're getting into it."
              description={`Let's go deeper into your priority of ${selectedAreaLabel}.`}
            >
              <p className={`text-sm leading-relaxed ${BODY_TEXT}`}>
                You may notice we ask a few similar questions.
              </p>

              <p className={`text-sm leading-relaxed ${BODY_TEXT}`}>
                The repetition is deliberate.
              </p>

              <p className={`text-sm leading-relaxed ${BODY_TEXT}`}>
                We are looking for what sits beneath the goal: the pressure, the
                pain, the need, the belief, and the reason to keep moving.
              </p>

              <button onClick={() => setPhase("depth")} className="primary-button">
                Go deeper
              </button>
            </CompassCard>
          )}

          {phase === "depth" && (
            <CompassCard
              eyebrow={`Reflection ${recursiveLayers.length + 1} of 7`}
              title={buildAdaptiveRecursiveQuestion({
                layer: recursiveLayers.length + 1,
                selectedAreaLabel,
                previousAnswer:
                  recursiveLayers[recursiveLayers.length - 1]?.answer ?? "",
                firstAnswer:
                  areaResponses.find((response) => response.area === selectedArea)
                    ?.answer ?? "",
              })}
              description={
                recursiveLayers.length > 0
                  ? "We are incorporating your answers into the questions as the process evolves. The more you provide, the more direction may appear."
                  : `Let's begin exploring why ${selectedAreaLabel.toLowerCase()} matters to you.`
              }
            >
              <textarea
                value={recursiveAnswer}
                onChange={(event) => setRecursiveAnswer(event.target.value)}
                placeholder="Answer openly. The more context you give, the more Compass can help reflect possible patterns, values, and next steps."
                rows={7}
                className="compass-textarea"
              />

              <button onClick={submitRecursiveAnswer} className="primary-button">
                Continue
              </button>
            </CompassCard>
          )}

          {phase === "core_reflection" && (
            <CompassCard
              title="Core pattern reflection"
              description={coreReflection.reflection}
            >
              <details className="rounded-2xl border border-zinc-800 bg-[#131313] p-4">
                <summary className={`cursor-pointer text-sm ${BODY_TEXT}`}>
                  Review your deeper reflections
                </summary>

                <div className="mt-4 space-y-4">
                  {recursiveLayers.map((layer) => (
                    <div
                      key={layer.layer}
                      className="rounded-xl border border-zinc-800 p-4"
                    >
                      <p className="text-sm text-[#d8b15f]">
                        {layer.question}
                      </p>

                      <p className={`mt-2 whitespace-pre-line text-sm ${BODY_TEXT}`}>
                        {layer.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </details>

              <textarea
                value={extraReflection}
                onChange={(event) => setExtraReflection(event.target.value)}
                placeholder="Would you like to clarify, question, refine, or add anything before continuing?"
                rows={5}
                className="compass-textarea"
              />

              <button
                onClick={() => setPhase("resistance")}
                className="primary-button"
              >
                Continue
              </button>
            </CompassCard>
          )}

          {phase === "resistance" && (
            <CompassCard
              title="What tends to get in the way?"
              description={`What usually interrupts, delays, emotionally complicates, or prevents movement toward ${selectedAreaLabel.toLowerCase()}?`}
            >
              <textarea
                value={resistanceAnswer}
                onChange={(event) => setResistanceAnswer(event.target.value)}
                placeholder="Describe the friction, emotional resistance, avoidance patterns, fears, or recurring interruptions."
                rows={8}
                className="compass-textarea"
              />

              <button onClick={submitResistance} className="primary-button">
                Analyze resistance
              </button>
            </CompassCard>
          )}

          {phase === "discussion" && (
            <CompassCard
              title="Let's discuss this a little further."
              description="There may still be useful insight available before finalizing your next step."
            >
              <div className={`rounded-[1.5rem] border border-zinc-800 bg-[#121212] p-5 text-sm leading-relaxed whitespace-pre-line ${BODY_TEXT}`}>
                {proposedStep}
              </div>

              <textarea
                value={discussionAnswer}
                onChange={(event) => setDiscussionAnswer(event.target.value)}
                placeholder="How does this land for you? What feels accurate, inaccurate, difficult, exciting, unrealistic, emotionally loaded, or important here?"
                rows={7}
                className="compass-textarea"
              />

              <button onClick={submitDiscussion} className="primary-button">
                Continue
              </button>
            </CompassCard>
          )}

          {phase === "execution_check" && (
            <CompassCard
              title="Do you feel able to execute this?"
              description="If this still feels too large, unclear, public, emotionally loaded, or difficult to begin, Compass will reduce the pressure further."
            >
              <textarea
                value={executionFeeling}
                onChange={(event) => setExecutionFeeling(event.target.value)}
                placeholder="Does this feel realistic, emotionally safe, sustainable, too large, too public, unclear, or difficult to begin?"
                rows={6}
                className="compass-textarea"
              />

              <button
                onClick={submitExecutionFeeling}
                className="primary-button"
              >
                Finalize next step
              </button>
            </CompassCard>
          )}

          {phase === "complete" && (
            <CompassCard
              title="Your next executable step"
              description="One real movement. Not the entire transformation."
            >
              <div className={`rounded-[1.5rem] border border-zinc-800 bg-[#121212] p-5 text-sm leading-relaxed whitespace-pre-line ${BODY_TEXT}`}>
                {finalStep}
              </div>

              {resonanceBridge.eligible && (
                <div className="rounded-[1.5rem] border border-zinc-800 bg-[#121212] p-5">
                  <p className={`whitespace-pre-line text-sm leading-relaxed ${BODY_TEXT}`}>
                    {resonanceBridge.reflection}
                  </p>

                  <a
                    href={
                      resonanceBridge.ctaHref ??
                      "https://www.oremea.com/?open=resonance"
                    }
                    className="primary-button inline-flex items-center justify-center"
                  >
                    {resonanceBridge.ctaLabel}
                  </a>
                </div>
              )}
            </CompassCard>
          )}
        </div>
      </section>

      <style jsx>{`
        .primary-button {
          margin-top: 1rem;
          width: 100%;
          border-radius: 999px;
          border: 1px solid #d8b15f;
          background: linear-gradient(180deg, #d8b15f, #9f7332);
          padding: 0.95rem 1.2rem;
          font-size: 0.92rem;
          color: #120d07;
          font-weight: 600;
          transition: 180ms ease;
        }

        .primary-button:hover {
          border-color: #e2c374;
          background: linear-gradient(180deg, #e2c374, #a87a38);
        }

        .selection-button {
          border-radius: 1.2rem;
          border: 1px solid #27272a;
          background: #131313;
          padding: 1rem;
          text-align: left;
          font-size: 0.92rem;
          color: #d8b15f;
          transition: 180ms ease;
        }

        .selection-button:hover {
          border-color: #d8b15f;
          background: #1a1a1a;
        }

        .compass-textarea {
          min-height: 170px;
          width: 100%;
          resize: none;
          border-radius: 1.5rem;
          border: 1px solid #3f3f46;
          background: #18110b;
          padding: 1rem 1.2rem;
          font-size: 0.95rem;
          line-height: 1.8;
          color: #f4f4f5;
          outline: none;
          transition: 180ms ease;
        }

        .compass-textarea::placeholder {
          color: #a1a1aa;
        }

        .compass-textarea:focus {
          border-color: #d8b15f;
          background: #1f1710;
        }
      `}</style>
    </main>
  );
}

function CompassCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-zinc-800 bg-[#0f0f0f]/96 p-6 shadow-2xl shadow-black/30 backdrop-blur">
      {eyebrow && (
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-zinc-400">
          {eyebrow}
        </p>
      )}

      <h1 className="font-serif text-3xl text-[#d8b15f] sm:text-4xl">
        {title}
      </h1>

      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-400 sm:text-base">
        {description}
      </p>

      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}