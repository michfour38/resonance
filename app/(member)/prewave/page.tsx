"use client";

import { useEffect, useMemo, useState } from "react";

type PreWavePageProps = {
  searchParams?: {
    pathway?: string;
  };
};

function getPreWaveBackgrounds() {
  return {
    desktop: "/images/desktop/bg-prewave.webp",
    mobile: "/images/mobile/bg-prewave.webp",
  };
}

const PREWAVE_QUESTIONS = [
  "What do you most hope this journey might help you understand more clearly about yourself?",
  "What kind of connection are you most longing for in your life right now?",
  "What do you think people often misunderstand about you at first?",
  "What tends to make you feel more open, and what tends to make you pull back?",
  "What are you hoping to experience differently in the way you relate going forward?",
  "What already feels like it may be shifting in you, even before the journey fully begins?",
] as const;

const STORAGE_KEY = "resonance_prewave_state_v1";

type PrewaveState = {
  pathway: "discover" | "relate";
  step: number;
  responses: string[];
  waveName: string;
};

function buildInitialState(pathway: "discover" | "relate"): PrewaveState {
  return {
    pathway,
    step: 1,
    responses: ["", "", "", "", "", ""],
    waveName: "",
  };
}

export default function PreWavePage({ searchParams }: PreWavePageProps) {
  const pathway = searchParams?.pathway === "relate" ? "relate" : "discover";

  const backgrounds = getPreWaveBackgrounds();

  const [state, setState] = useState<PrewaveState>(() =>
    buildInitialState(pathway)
  );
  const [currentResponse, setCurrentResponse] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        const fresh = buildInitialState(pathway);
        setState(fresh);
        setCurrentResponse(fresh.responses[0] ?? "");
        return;
      }

      const parsed = JSON.parse(raw) as Partial<PrewaveState>;

      const hydrated: PrewaveState = {
        pathway:
          parsed.pathway === "relate" || parsed.pathway === "discover"
            ? parsed.pathway
            : pathway,
        step:
          typeof parsed.step === "number" && parsed.step >= 1 && parsed.step <= 8
            ? parsed.step
            : 1,
        responses:
          Array.isArray(parsed.responses) && parsed.responses.length === 6
            ? parsed.responses.map((v) => String(v ?? ""))
            : ["", "", "", "", "", ""],
        waveName: String(parsed.waveName ?? ""),
      };

      if (hydrated.pathway !== pathway) {
        hydrated.pathway = pathway;
      }

      setState(hydrated);

      if (hydrated.step >= 1 && hydrated.step <= 6) {
        setCurrentResponse(hydrated.responses[hydrated.step - 1] ?? "");
      } else {
        setCurrentResponse("");
      }
    } catch {
      const fresh = buildInitialState(pathway);
      setState(fresh);
      setCurrentResponse(fresh.responses[0] ?? "");
    }
  }, [pathway]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore localStorage failures
    }
  }, [state]);

  const journeyHref = useMemo(() => {
    return `/journey/unlock?pathway=${state.pathway}`;
  }, [state.pathway]);

  const mirrorIntro =
    state.pathway === "relate"
      ? "Something is already becoming visible in how you move toward connection."
      : "Something is already becoming visible in what you are beginning to see more clearly within yourself.";

  const mirrorBody =
    state.pathway === "relate"
      ? "Across what you’ve shared so far, there are early signs of pattern, openness, and self-protection beginning to take shape. This is only a glimpse of what becomes clearer when your reflections are held across time."
      : "Across what you’ve shared so far, there are early signs of pattern, tension, and emerging truth beginning to take shape. This is only a glimpse of what becomes clearer when your reflections are held across time.";

  function saveCurrentResponseAndAdvance() {
    if (state.step < 1 || state.step > 6) return;
    if (!currentResponse.trim()) return;

    const nextResponses = [...state.responses];
    nextResponses[state.step - 1] = currentResponse.trim();

    setState((prev) => ({
      ...prev,
      responses: nextResponses,
      step: Math.min(prev.step + 1, 8),
    }));

    setCurrentResponse("");
  }

  function saveWaveNameAndAdvance() {
    if (!state.waveName.trim()) return;

    setState((prev) => ({
      ...prev,
      waveName: prev.waveName.trim(),
      step: 8,
    }));
  }

  function goBack() {
    if (state.step <= 1) return;

    const nextStep = state.step - 1;

    setState((prev) => ({
      ...prev,
      step: nextStep,
    }));

    if (nextStep >= 1 && nextStep <= 6) {
      setCurrentResponse(state.responses[nextStep - 1] ?? "");
    }
  }

  function resetPrewave() {
    const fresh = buildInitialState(pathway);
    setState(fresh);
    setCurrentResponse("");
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignore localStorage failures
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${backgrounds.desktop})` }}
      />

      <div
        className="fixed inset-0 z-0 block bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${backgrounds.mobile})` }}
      />

      <div className="pointer-events-none fixed inset-0 z-10 bg-black/45" />

      <div className="relative z-20 mx-auto max-w-4xl px-6 py-12 md:py-16">
        <div className="rounded-[2rem] border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px] md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Pre-Wave
          </p>

          <h1 className="mt-4 text-4xl font-semibold text-white">
            Before your Wave begins
          </h1>

          <p className="mt-5 text-lg leading-8 text-zinc-200">
            This is the threshold before the full journey opens.
          </p>

          {state.step >= 1 && state.step <= 6 && (
            <div className="mt-10 rounded-3xl border border-zinc-800/90 bg-black/45 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Reflection {state.step} of 6
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                {PREWAVE_QUESTIONS[state.step - 1]}
              </h2>

              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                rows={6}
                className="mt-6 w-full resize-none rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#c8a96a]/30"
                placeholder="Write what feels true..."
              />

              {!currentResponse.trim() && (
                <p className="mt-3 text-xs text-zinc-500">
                  Write something to continue
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {state.step > 1 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:bg-white/5"
                  >
                    Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={saveCurrentResponseAndAdvance}
                  disabled={!currentResponse.trim()}
                  className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {state.step === 7 && (
            <div className="mt-10 rounded-3xl border border-zinc-800/90 bg-black/45 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Wave name
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                What name feels true for this Wave?
              </h2>

              <p className="mt-4 text-base leading-8 text-zinc-300">
                Your seeded Journey rooms stay the same. This vote shapes the
                dynamic name of your Wave, not the room titles themselves.
              </p>

              <input
                type="text"
                value={state.waveName}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, waveName: e.target.value }))
                }
                className="mt-6 w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#c8a96a]/30"
                placeholder="Enter the Wave name you want to vote for..."
              />

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:bg-white/5"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={saveWaveNameAndAdvance}
                  disabled={!state.waveName.trim()}
                  className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {state.step >= 8 && (
            <>
              <div className="mt-10 rounded-3xl border border-zinc-800/90 bg-black/45 p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Early Mirror
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Something is already forming
                </h2>

                <p className="mt-5 text-base leading-8 text-zinc-200">
                  {mirrorIntro}
                </p>

                <p className="mt-4 text-base leading-8 text-zinc-300">
                  {mirrorBody}
                </p>

                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  This is only an early glimpse. Deeper reflection becomes
                  possible as your journey continues.
                </p>

                {state.waveName.trim() ? (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                      Your Wave
                    </p>
                    <p className="mt-2 text-lg text-white">
                      {state.waveName.trim()}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 rounded-3xl border border-[#c8a96a]/35 bg-[#c8a96a]/10 p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.25em] text-[#f1dfb4]/80">
                  Journey
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Enter Your Full 10-Week Resonance Journey
                </h2>

                <p className="mt-4 text-base leading-8 text-zinc-100">
                  Continue beyond Pre-Wave into a structured 10-week relational
                  journey designed to deepen how you understand yourself and
                  connect with others.
                </p>

                <p className="mt-4 text-base leading-8 text-zinc-200">
                  Move through guided weekly rooms, daily reflections, and
                  progressively deeper inquiry into patterns, attraction,
                  emotional triggers, communication, and relational truth.
                </p>

                <p className="mt-4 text-base leading-8 text-zinc-200">
                  Your Journey includes one deeper Mirror reflection at the end,
                  drawing together what you’ve shared into a fuller synthesis of
                  your patterns, growth, and direction.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={journeyHref}
                    className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10"
                  >
                    Unlock Your Journey
                  </a>

                  <button
                    type="button"
                    onClick={resetPrewave}
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:bg-white/5"
                  >
                    Start over
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}