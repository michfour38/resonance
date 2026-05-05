"use client";

import { useMemo, useState } from "react";
import {
  FearAnswers,
  initialFearAnswers,
  runFearLens,
} from "./fear.service";

export default function CompassPage() {
  const [answers, setAnswers] = useState<FearAnswers>(initialFearAnswers);
  const [visibleHistory, setVisibleHistory] = useState<
    { label: string; value: string }[]
  >([]);

  const output = useMemo(() => runFearLens(answers), [answers]);
  const prompt = output.currentPrompt;
  const currentValue = prompt ? answers[prompt.stepKey] : "";

  const updateAnswer = (value: string) => {
    if (!prompt) return;
    setAnswers((current) => ({
      ...current,
      [prompt.stepKey]: value,
    }));
  };

  const continueFlow = () => {
    if (!prompt || !String(currentValue).trim()) return;

    setVisibleHistory((current) => [
      ...current,
      {
        label: prompt.title,
        value: String(currentValue),
      },
    ]);

    setAnswers((current) => ({ ...current }));
  };

  const reset = () => {
    setAnswers(initialFearAnswers);
    setVisibleHistory([]);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0705] text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,165,86,0.18),transparent_34%),radial-gradient(circle_at_50%_85%,rgba(112,73,32,0.20),transparent_42%),linear-gradient(180deg,#1a120b_0%,#0a0705_54%,#050403_100%)]" />
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(115deg,transparent_0%,rgba(255,235,190,0.18)_45%,transparent_72%)]" />

      <section className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
        <header className="text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.42em] text-amber-200/45">
            The Compass
          </p>

          <h1 className="font-serif text-5xl leading-none text-amber-100 sm:text-6xl">
            by Oremea
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-stone-400">
            When something feels off, The Compass brings you back to what is
            happening now.
          </p>

          <p className="mt-5 font-serif text-xl text-amber-100/85">
            Show me what to do next.
          </p>
        </header>

        <div className="flex flex-1 items-center py-14">
          <section className="mx-auto w-full max-w-2xl space-y-8">
            {visibleHistory.length > 0 ? (
              <div className="space-y-5 border-l border-amber-200/12 pl-5">
                {visibleHistory.map((item, index) => (
                  <div key={`${item.label}-${index}`}>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-amber-200/35">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-400">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {!output.isComplete && prompt ? (
              <div className="space-y-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-200/45 to-transparent" />

                {output.regressionDetected && prompt.helperText ? (
                  <div className="rounded-[1.5rem] border border-amber-200/10 bg-[#130e09]/58 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
                    <p className="text-xs uppercase tracking-[0.22em] text-amber-200/45">
                      Return point
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-amber-100/72">
                      {prompt.helperText}
                    </p>
                  </div>
                ) : null}

                <div>
                  <h2 className="font-serif text-3xl leading-tight text-amber-100 sm:text-4xl">
                    {prompt.title}
                  </h2>

                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-300">
                    {prompt.prompt}
                  </p>

                  {prompt.helperText && !output.regressionDetected ? (
                    <p className="mt-4 text-sm leading-relaxed text-stone-500">
                      {prompt.helperText}
                    </p>
                  ) : null}
                </div>

                {prompt.inputType === "choice" ? (
                  <div className="flex flex-wrap gap-3">
                    {prompt.choices?.map((choice) => (
                      <button
                        key={choice.value}
                        type="button"
                        onClick={() => updateAnswer(choice.value)}
                        className={`rounded-full border px-6 py-3 text-sm transition ${
                          currentValue === choice.value
                            ? "border-amber-200/45 bg-amber-100/12 text-amber-100 shadow-[0_0_28px_rgba(214,165,86,0.10)]"
                            : "border-amber-200/12 bg-[#150f0a]/40 text-stone-400 hover:border-amber-200/28 hover:text-amber-100"
                        }`}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-amber-200/10 bg-[#130e09]/58 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur">
                    <textarea
                      value={currentValue}
                      onChange={(event) => updateAnswer(event.target.value)}
                      placeholder={prompt.placeholder}
                      rows={7}
                      className="min-h-[180px] w-full resize-none bg-transparent text-lg leading-relaxed text-stone-100 outline-none placeholder:text-stone-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs uppercase tracking-[0.26em] text-stone-600 transition hover:text-stone-400"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    disabled={!String(currentValue).trim()}
                    onClick={continueFlow}
                    className="rounded-full border border-amber-200/24 bg-amber-100/8 px-6 py-3 text-xs uppercase tracking-[0.24em] text-amber-100 transition hover:bg-amber-100/14 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Show me the next question
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-200/45 to-transparent" />

                <div>
                  <h2 className="font-serif text-4xl leading-tight text-amber-100">
                    The next step is visible.
                  </h2>

                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-300">
                    Compass classified the move. You named the step.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-amber-200/10 bg-[#130e09]/58 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-amber-200/45">
                    Output type
                  </p>

                  <p className="mt-3 font-serif text-3xl text-amber-100">
                    {answers.outputType || "—"}
                  </p>

                  <div className="mt-8 space-y-6">
                    <Summary label="What felt off" value={answers.signal} />
                    <Summary label="Concern" value={answers.projection} />
                    <Summary label="Reality" value={answers.presentReality} />
                    <Summary label="Within control" value={answers.control} />
                    <Summary label="Next step" value={answers.nextStep} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full border border-amber-200/24 bg-amber-100/8 px-6 py-3 text-xs uppercase tracking-[0.24em] text-amber-100 transition hover:bg-amber-100/14"
                >
                  Begin again
                </button>
              </div>
            )}
          </section>
        </div>

        <footer className="pb-4 text-center text-[11px] uppercase tracking-[0.32em] text-amber-200/28">
          Clarity · Direction · Execution
        </footer>
      </section>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.26em] text-amber-200/45">
        {label}
      </p>
      <p className="mt-2 text-base leading-relaxed text-stone-200">
        {value || "—"}
      </p>
    </div>
  );
}