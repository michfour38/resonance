"use client";

import { useMemo, useState } from "react";
import { runCompass } from "./compass.service";

export default function CompassPage() {
  const [rawInput, setRawInput] = useState("");
  const [confirmedEmotion, setConfirmedEmotion] = useState("");
  const [confirmedBelief, setConfirmedBelief] = useState("");
  const [refinedBelief, setRefinedBelief] = useState("");
  const [nextStep, setNextStep] = useState("");

  const compass = useMemo(() => {
    return runCompass({
      rawInput,
      lens: "BELIEF",
      confirmedEmotion: confirmedEmotion || null,
      confirmedBelief: confirmedBelief || null,
    });
  }, [rawInput, confirmedEmotion, confirmedBelief]);

  const detectedEmotionText =
    compass.detectedEmotions.length > 0
      ? compass.detectedEmotions.map((item) => item.emotion).join(", ")
      : "No exact emotion detected yet.";

  return (
    <main className="min-h-screen bg-[#080706] text-stone-100">
      <section className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,134,64,0.18),_transparent_34%),linear-gradient(180deg,_rgba(36,28,20,0.82),_rgba(8,7,6,1)_48%,_rgba(13,10,8,1))]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(115deg,_transparent_0%,_rgba(255,255,255,0.18)_45%,_transparent_70%)]" />

        <div className="relative mx-auto max-w-3xl">
          <header className="mb-8 pt-6 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.38em] text-amber-200/70">
              Oremea
            </p>

            <h1 className="font-serif text-4xl text-amber-100 sm:text-5xl">
              The Compass
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-stone-300">
              Turn self-awareness into one executable next step.
            </p>

            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-amber-200/55">
              Belief Lens
            </p>
          </header>

          <section className="mb-5 rounded-[2rem] border border-amber-200/18 bg-[#16110d]/88 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <h2 className="font-serif text-2xl text-amber-100">
              What’s on your mind?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-stone-300">
              Start with your own words. The Compass will first look for the
              emotional signal, then guide you toward the belief underneath it.
            </p>

            <textarea
              value={rawInput}
              onChange={(event) => {
                setRawInput(event.target.value);
                setConfirmedEmotion("");
                setConfirmedBelief("");
                setRefinedBelief("");
                setNextStep("");
              }}
              placeholder="Example: I feel like I can’t live without them."
              rows={6}
              className="mt-5 min-h-[150px] w-full resize-none rounded-2xl border border-amber-200/12 bg-[#211912]/80 px-4 py-3 text-sm leading-relaxed text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/35 focus:bg-[#251c14]"
            />
          </section>

          <section className="mb-5 rounded-[2rem] border border-amber-200/16 bg-[#120f0c]/86 p-6 shadow-xl shadow-black/25 backdrop-blur">
            <p className="mb-2 text-xs uppercase tracking-[0.32em] text-amber-200/65">
              Emotion Scan
            </p>

            <p className="text-sm leading-relaxed text-stone-300">
              {detectedEmotionText}
            </p>

            {compass.clarificationQuestion ? (
              <p className="mt-4 text-base leading-relaxed text-amber-100">
                {compass.clarificationQuestion}
              </p>
            ) : null}

            <input
              value={confirmedEmotion}
              onChange={(event) => setConfirmedEmotion(event.target.value)}
              placeholder="Name the exact emotion here."
              className="mt-5 w-full rounded-2xl border border-amber-200/12 bg-[#211912]/80 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/35 focus:bg-[#251c14]"
            />
          </section>

          {confirmedEmotion.trim().length > 0 ? (
            <section className="mb-5 rounded-[2rem] border border-amber-200/16 bg-[#120f0c]/86 p-6 shadow-xl shadow-black/25 backdrop-blur">
              <p className="mb-2 text-xs uppercase tracking-[0.32em] text-amber-200/65">
                Belief Extraction
              </p>

              <p className="text-base leading-relaxed text-amber-100">
                {compass.possibleBelief}
              </p>

              <textarea
                value={confirmedBelief}
                onChange={(event) => setConfirmedBelief(event.target.value)}
                placeholder="Write the belief in your own words."
                rows={4}
                className="mt-5 min-h-[120px] w-full resize-none rounded-2xl border border-amber-200/12 bg-[#211912]/80 px-4 py-3 text-sm leading-relaxed text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/35 focus:bg-[#251c14]"
              />
            </section>
          ) : null}

          {confirmedBelief.trim().length > 0 ? (
            <>
              <section className="mb-5 rounded-[2rem] border border-amber-200/16 bg-[#120f0c]/86 p-6 shadow-xl shadow-black/25 backdrop-blur">
                <p className="mb-2 text-xs uppercase tracking-[0.32em] text-amber-200/65">
                  Reality + Refinement
                </p>

                <div className="space-y-4 text-sm leading-relaxed text-stone-300">
                  <p>{compass.protectionQuestion}</p>
                  <p>{compass.realityQuestion}</p>
                  <p>{compass.refinedBeliefPrompt}</p>
                </div>

                <textarea
                  value={refinedBelief}
                  onChange={(event) => setRefinedBelief(event.target.value)}
                  placeholder="Write the more complete belief here."
                  rows={4}
                  className="mt-5 min-h-[120px] w-full resize-none rounded-2xl border border-amber-200/12 bg-[#211912]/80 px-4 py-3 text-sm leading-relaxed text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/35 focus:bg-[#251c14]"
                />
              </section>

              <section className="mb-5 rounded-[2rem] border border-amber-200/16 bg-[#120f0c]/86 p-6 shadow-xl shadow-black/25 backdrop-blur">
                <p className="mb-2 text-xs uppercase tracking-[0.32em] text-amber-200/65">
                  Next Honest Step
                </p>

                <p className="text-sm leading-relaxed text-stone-300">
                  {compass.nextHonestStep}
                </p>

                <textarea
                  value={nextStep}
                  onChange={(event) => setNextStep(event.target.value)}
                  placeholder="Write one honest, executable next step."
                  rows={3}
                  className="mt-5 min-h-[100px] w-full resize-none rounded-2xl border border-amber-200/12 bg-[#211912]/80 px-4 py-3 text-sm leading-relaxed text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/35 focus:bg-[#251c14]"
                />
              </section>
            </>
          ) : null}

          <section className="mt-6 rounded-[2rem] border border-amber-200/22 bg-[#1a130d]/92 p-6 shadow-2xl shadow-black/40">
            <p className="mb-3 text-xs uppercase tracking-[0.32em] text-amber-200/65">
              Compass Summary
            </p>

            <div className="space-y-3 text-sm leading-relaxed text-stone-300">
              <SummaryLine label="Your words" value={rawInput} />
              <SummaryLine label="Exact emotion" value={confirmedEmotion} />
              <SummaryLine label="Belief" value={confirmedBelief} />
              <SummaryLine label="Refined belief" value={refinedBelief} />
              <SummaryLine label="Next honest step" value={nextStep} />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold tracking-[0.16em] text-amber-100">
        {label}:
      </span>{" "}
      <span className="text-stone-300">{value.trim() || "—"}</span>
    </p>
  );
}