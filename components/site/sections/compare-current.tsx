import type { CompareMode } from "@/app/compare/page";

type CompareCurrentProps = {
  mode: CompareMode;
};

export function CompareCurrent({
  mode,
}: CompareCurrentProps) {
  return (
    <section className="border-b border-white/5 bg-zinc-950/60">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-14 md:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.28em] text-amber-200/70">
              Intentional Connection
            </p>

            <h2 className="text-4xl font-light leading-tight text-zinc-100">
              The Current
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Intentional dating for self-aware individuals.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10">
            {mode === "experience" ? (
              <div className="space-y-8">
                <div className="rounded-3xl border border-[#2A2418] bg-[#11100D] p-8">
                  <p className="font-serif text-2xl leading-relaxed text-[#EAEAEA] md:text-3xl">
                    Like meeting people without needing to perform first.
                  </p>

                  <p className="mt-8 font-serif text-xl leading-relaxed text-[#BFBFBF]">
                    Like connection becoming calmer, clearer, and less chaotic.
                  </p>

                  <p className="mt-8 font-serif text-xl leading-relaxed text-[#BFBFBF]">
                    Like attraction existing without confusion.
                  </p>

                  <p className="mt-8 font-serif text-xl leading-relaxed text-[#BFBFBF]">
                    Like being seen beyond a profile or a swipe.
                  </p>

                  <p className="mt-8 font-serif text-xl leading-relaxed text-[#BFBFBF]">
                    Like entering connection with more honesty, steadiness, and self-awareness already present.
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
                    The Current is an intentional dating environment
                    designed for individuals seeking meaningful
                    connection beyond swipe-based interaction,
                    surface-level attraction, and low-awareness relational patterns.
                  </p>
                </div>

                <div>
                  <p className="mb-4 text-sm uppercase tracking-[0.18em] text-zinc-500">
                    Designed For
                  </p>

                  <ul className="grid gap-3 text-base leading-7 text-zinc-400 md:grid-cols-2">
                    <li>• intentional daters</li>
                    <li>• self-aware individuals</li>
                    <li>• reflective communicators</li>
                    <li>• relationship-minded users</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-4 text-sm uppercase tracking-[0.18em] text-zinc-500">
                    Includes
                  </p>

                  <ul className="grid gap-3 text-base leading-7 text-zinc-400 md:grid-cols-2">
                    <li>• intentional connection systems</li>
                    <li>• awareness-first matching philosophy</li>
                    <li>• profile reflection layers</li>
                    <li>• communication-oriented interaction</li>
                    <li>• progression beyond swipe mechanics</li>
                    <li>• ecosystem-connected participation</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                  <p className="text-sm leading-7 text-zinc-400">
                    The Current is positioned as a continuation layer
                    after foundational awareness work through Resonance.
                  </p>
                </div>

                <div className="rounded-full border border-amber-200/20 bg-amber-100/[0.05] px-5 py-2 text-sm text-amber-100 w-fit">
                  Recommended After Resonance
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}