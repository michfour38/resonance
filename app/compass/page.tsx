"use client";

import { useMemo, useState } from "react";
import { runCompass } from "./compass.service";

type CompassField = {
  key: keyof CompassState;
  label: string;
  prompt: string;
  placeholder: string;
};

type CompassState = {
  state: string;
  ifCondition: string;
  thenAction: string;
  elseResponse: string;
  observe: string;
  repairRepeat: string;
  nextStep: string;
};

const fields: CompassField[] = [
  {
    key: "state",
    label: "STATE",
    prompt: "What aligned state are you building toward?",
    placeholder: "Example: I am uncovering the belief driving my grief.",
  },
  {
    key: "ifCondition",
    label: "IF",
    prompt: "What emotion, thought, contradiction, or question appears?",
    placeholder: "Example: If I feel like I cannot live without them...",
  },
  {
    key: "thenAction",
    label: "THEN",
    prompt: "What belief needs to be seen clearly?",
    placeholder: "Example: Then I look for the belief underneath the pain.",
  },
  {
    key: "elseResponse",
    label: "ELSE",
    prompt: "What happens if clarity is not visible yet?",
    placeholder:
      "Example: Else I continue the search while allowing the emotion.",
  },
  {
    key: "observe",
    label: "OBSERVE",
    prompt: "What belief, phrase, or emotional wave keeps repeating?",
    placeholder: "Example: I notice the belief that love should not end.",
  },
  {
    key: "repairRepeat",
    label: "REPAIR / REPEAT",
    prompt: "What belief needs testing, refining, or returning to?",
    placeholder: "Example: I test whether this belief is fully true.",
  },
  {
    key: "nextStep",
    label: "NEXT STEP",
    prompt: "What is the one executable action now?",
    placeholder: "Example: I write the belief plainly and sit with it.",
  },
];

const initialState: CompassState = {
  state: "",
  ifCondition: "",
  thenAction: "",
  elseResponse: "",
  observe: "",
  repairRepeat: "",
  nextStep: "",
};

export default function CompassPage() {
  const [compass, setCompass] = useState<CompassState>(initialState);

  const completedCount = useMemo(() => {
    return Object.values(compass).filter((value) => value.trim().length > 0)
      .length;
  }, [compass]);

  const rawInput = useMemo(() => {
    return Object.values(compass).join(" ");
  }, [compass]);

  const generated = useMemo(() => {
    return runCompass({
      rawInput,
      lens: "BELIEF",
    });
  }, [rawInput]);

  const updateField = (key: keyof CompassState, value: string) => {
    setCompass((current) => ({
      ...current,
      [key]: value,
    }));
  };

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
              Clarity. Direction. Execution.
            </p>
          </header>

          <section className="mb-6 rounded-[2rem] border border-amber-200/18 bg-[#16110d]/88 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl text-amber-100">
                Belief Lens
              </h2>

              <span className="rounded-full border border-amber-200/20 bg-amber-100/8 px-3 py-1 text-xs text-amber-100/80">
                {completedCount}/7
              </span>
            </div>

            <p className="leading-relaxed text-stone-300">
              Use grief, pressure, longing, or contradiction as the entry point.
              The Compass will help reveal the belief underneath the emotion and
              turn it into one clear next step.
            </p>
          </section>

          <section className="mb-6 rounded-[2rem] border border-amber-200/16 bg-[#120f0c]/86 p-5 shadow-xl shadow-black/25 backdrop-blur">
            <p className="mb-2 text-xs uppercase tracking-[0.32em] text-amber-200/65">
              Detected Belief
            </p>

            <p className="text-sm leading-relaxed text-stone-300">
              {generated.belief
                ? generated.belief
                : "Begin entering your words below. The belief will appear here when enough signal is present."}
            </p>

            {generated.pattern ? (
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-amber-100/55">
                Pattern: {generated.pattern}
              </p>
            ) : null}
          </section>

          <section className="space-y-4">
            {fields.map((field, index) => (
              <article
                key={field.key}
                className="rounded-[1.7rem] border border-amber-200/14 bg-[#120f0c]/86 p-5 shadow-xl shadow-black/25 backdrop-blur"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-200/20 bg-amber-100/8 text-xs text-amber-100">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold tracking-[0.24em] text-amber-100">
                      {field.label}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-400">
                      {field.prompt}
                    </p>
                  </div>
                </div>

                <textarea
                  value={compass[field.key]}
                  onChange={(event) => updateField(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className="min-h-[120px] w-full resize-none rounded-2xl border border-amber-200/12 bg-[#211912]/80 px-4 py-3 text-sm leading-relaxed text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/35 focus:bg-[#251c14]"
                />
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-[2rem] border border-amber-200/22 bg-[#1a130d]/92 p-6 shadow-2xl shadow-black/40">
            <p className="mb-3 text-xs uppercase tracking-[0.32em] text-amber-200/65">
              Generated Compass Rule
            </p>

            <div className="space-y-3 text-sm leading-relaxed text-stone-300">
              <RuleLine label="STATE" value={compass.state || generated.state} />
              <RuleLine label="IF" value={compass.ifCondition || generated.if} />
              <RuleLine
                label="THEN"
                value={compass.thenAction || generated.then}
              />
              <RuleLine
                label="ELSE"
                value={compass.elseResponse || generated.else}
              />
              <RuleLine label="OBSERVE" value={compass.observe || generated.observe} />
              <RuleLine
                label="REPAIR / REPEAT"
                value={compass.repairRepeat || generated.repair}
              />
              <RuleLine
                label="NEXT STEP"
                value={compass.nextStep || generated.nextStep}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function RuleLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold tracking-[0.16em] text-amber-100">
        {label}:
      </span>{" "}
      <span className="text-stone-300">{value.trim() || "—"}</span>
    </p>
  );
}