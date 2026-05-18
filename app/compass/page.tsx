"use client";

import Image from "next/image";
import { useState } from "react";

type CompassField = {
  key: keyof CompassState;
  title: string;
  prompt: string;
  placeholder: string;
};

type CompassState = {
  direction: string;
  challenge: string;
  execution: string;
  resistance: string;
  calibration: string;
  consistency: string;
  nextMove: string;
};

const fields: CompassField[] = [
  {
    key: "direction",
    title: "Desired Direction",
    prompt:
      "Describe the version of yourself, business, body, relationship, or life you are intentionally building toward.",
    placeholder:
      "Example: I become consistent, clear, physically disciplined, and financially decisive.",
  },

  {
    key: "challenge",
    title: "Current Friction",
    prompt:
      "What repeatedly pulls you off course, delays execution, drains momentum, or creates internal conflict?",
    placeholder:
      "Example: I overthink instead of moving when the decision feels emotionally loaded.",
  },

  {
    key: "execution",
    title: "Execution Standard",
    prompt:
      "What behavior, decision, or standard must now become non-negotiable?",
    placeholder:
      "Example: I execute the next clear step before seeking emotional certainty.",
  },

  {
    key: "resistance",
    title: "Resistance Pattern",
    prompt:
      "How do you normally avoid discomfort, delay action, self-sabotage, or disconnect from the goal?",
    placeholder:
      "Example: I reopen loops instead of tolerating temporary discomfort.",
  },

  {
    key: "calibration",
    title: "Alignment Check",
    prompt:
      "What would tell you that your actions are finally matching your stated values and direction?",
    placeholder:
      "Example: My daily behavior becomes calmer, cleaner, more consistent, and less reactive.",
  },

  {
    key: "consistency",
    title: "Consistency Reset",
    prompt:
      "When you fall out of alignment, how will you return quickly without collapsing momentum?",
    placeholder:
      "Example: I reset immediately instead of turning one missed action into a lost week.",
  },

  {
    key: "nextMove",
    title: "Next Executable Step",
    prompt:
      "What is the single clearest action you can physically execute next?",
    placeholder:
      "Example: I publish the page, send the proposal, complete the workout, or make the decision today.",
  },
];

const initialState: CompassState = {
  direction: "",
  challenge: "",
  execution: "",
  resistance: "",
  calibration: "",
  consistency: "",
  nextMove: "",
};

export default function CompassPage() {
  const [compass, setCompass] =
    useState<CompassState>(initialState);

  const updateField = (
    key: keyof CompassState,
    value: string,
  ) => {
    setCompass((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-[#080706] text-stone-100">
      <section className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,134,64,0.14),_transparent_32%),linear-gradient(180deg,_rgba(30,24,18,0.88),_rgba(8,7,6,1)_48%,_rgba(11,9,7,1))]" />

        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(120deg,_transparent_0%,_rgba(255,255,255,0.12)_45%,_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl">
          <header className="mb-12 pt-6 text-center">
            <div className="mx-auto mb-6 flex justify-center">
              <Image
                src="/image/compass-logo.webp"
                alt="The Compass by Oremea"
                width={540}
                height={160}
                priority
                className="h-auto w-[320px] sm:w-[420px]"
              />
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-300">
              The Compass helps you convert vision into aligned execution.
              Clarify the direction, identify the friction, strengthen the
              standard, and define the next physical move that brings your life,
              business, relationships, health, or goals into alignment.
            </p>

            <p className="mt-4 text-sm uppercase tracking-[0.28em] text-amber-200/55">
              Clarity. Direction. Execution.
            </p>
          </header>

          <section className="space-y-5">
            {fields.map((field) => (
              <article
                key={field.key}
                className="rounded-[1.8rem] border border-amber-200/12 bg-[#120f0c]/88 p-6 shadow-2xl shadow-black/25 backdrop-blur"
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold tracking-[0.08em] text-amber-100">
                    {field.title}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-stone-400">
                    {field.prompt}
                  </p>
                </div>

                <textarea
                  value={compass[field.key]}
                  onChange={(event) =>
                    updateField(field.key, event.target.value)
                  }
                  placeholder={field.placeholder}
                  rows={5}
                  className="min-h-[140px] w-full resize-none rounded-[1.5rem] border border-amber-200/10 bg-[#211912]/82 px-5 py-4 text-sm leading-relaxed text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/30 focus:bg-[#261d15]"
                />
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}