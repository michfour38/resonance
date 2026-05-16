import type { CompareMode } from "@/app/compare/page";

type CompareCompassProps = {
  mode: CompareMode;
};

export function CompareCompass({
  mode,
}: CompareCompassProps) {
  return (
    <section className="border-b border-white/5 bg-zinc-950/60">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-14 md:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.28em] text-amber-200/70">
              Direction & Execution
            </p>

            <h2 className="text-4xl font-light leading-tight text-zinc-100">
              Compass
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Turn self-awareness into one executable next step.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10">
            {mode === "experience" ? (
              <div className="space-y-8">
                <div className="rounded-3xl border border-[#2A2418] bg-[#11100D] p-8">
                  <p className="font-serif text-2xl leading-relaxed text-[#EAEAEA] md:text-3xl">
                    Like the noise finally reducing enough to hear what matters.
                  </p>

                  <p className="mt-8 font-serif text-xl leading-relaxed text-[#BFBFBF]">
                    Like your thoughts becoming directional instead of circular.
                  </p>

                  <p className="mt-8 font-serif text-xl leading-relaxed text-[#BFBFBF]">
                    Like movement replacing internal friction.
                  </p>

                  <p className="mt-8 font-serif text-xl leading-relaxed text-[#BFBFBF]">
                    Like clarity becoming executable.
                  </p>

                  <p className="mt-8 font-serif text-xl leading-relaxed text-[#BFBFBF]">
                    Like finally moving with yourself instead of against yourself.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <p className="mb-4 text-sm uppercase tracking-[0.18em] text-zinc-500">
                    Focus
                  </p>

                  <p className="text-base leading-8 text-zinc-300">
                    Compass is a structured decision and execution layer
                    designed to convert awareness into directional movement,
                    executable next steps, and aligned behavioural action.
                  </p>
                </div>

                <div>
                  <p className="mb-4 text-sm uppercase tracking-[0.18em] text-zinc-500">
                    Designed For
                  </p>

                  <ul className="grid gap-3 text-base leading-7 text-zinc-400 md:grid-cols-2">
                    <li>• personal goalsetting</li>
                    <li>• couples alignment</li>
                    <li>• family direction systems</li>
                    <li>• shared execution structures</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-4 text-sm uppercase tracking-[0.18em] text-zinc-500">
                    Includes
                  </p>

                  <ul className="grid gap-3 text-base leading-7 text-zinc-400 md:grid-cols-2">
                    <li>• structured goal frameworks</li>
                    <li>• contradiction detection</li>
                    <li>• state / action mapping</li>
                    <li>• execution pathway systems</li>
                    <li>• next-step synthesis</li>
                    <li>• behavioural alignment support</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                  <p className="text-sm leading-7 text-zinc-400">
                    Compass helps users identify the tension between what they want,
                    what they protect, and what keeps interrupting movement —
                    then translates that into one executable next step.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}