"use client";

import { useMemo, useState } from "react";

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
    placeholder: "Example: I remain clear, calm, and self-led.",
  },
  {
    key: "ifCondition",
    label: "IF",
    prompt: "What condition, trigger, contradiction, or test appears?",
    placeholder: "Example: If I feel pulled to override my boundary...",
  },
  {
    key: "thenAction",
    label: "THEN",
    prompt: "What do you commit to doing?",
    placeholder: "Example: Then I pause, name the boundary, and do not act from urgency.",
  },
  {
    key: "elseResponse",
    label: "ELSE",
    prompt: "What happens if you falter or override yourself?",
    placeholder: "Example: Else I acknowledge the pattern without excusing it.",
  },
  {
    key: "observe",
    label: "OBSERVE",
    prompt: "What pattern must be watched over time?",
    placeholder: "Example: I watch whether my actions match my stated values.",
  },
  {
    key: "repairRepeat",
    label: "REPAIR / REPEAT",
    prompt: "Did the behavior truly change, or did the loop repeat?",
    placeholder: "Example: If it repeats, I repair quickly and return to the rule.",
  },
  {
    key: "nextStep",
    label: "NEXT STEP",
    prompt: "What is the one executable action now?",
    placeholder: "Example: I send one clear message and do not reopen the loop today.",
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
    return Object.values(compass).filter((value) => value.trim().length > 0).length;
  }, [compass]);

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
                Build your rule
              </h2>
              <span className="rounded-full border border-amber-200/20 bg-amber-100/8 px-3 py-1 text-xs text-amber-100/80">
                {completedCount}/7
              </span>
            </div>

            <p className="leading-relaxed text-stone-300">
              The Compass turns a situation, goal, or repeating loop into a clear
              behavioral rule. Define the state, the test, the action, the fallback,
              the observation, the repair, and the next move.
            </p>
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
              <RuleLine label="STATE" value={compass.state} />
              <RuleLine label="IF" value={compass.ifCondition} />
              <RuleLine label="THEN" value={compass.thenAction} />
              <RuleLine label="ELSE" value={compass.elseResponse} />
              <RuleLine label="OBSERVE" value={compass.observe} />
              <RuleLine label="REPAIR / REPEAT" value={compass.repairRepeat} />
              <RuleLine label="NEXT STEP" value={compass.nextStep} />
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
      <span className="text-stone-300">
        {value.trim() || "—"}
      </span>
    </p>
  );
}