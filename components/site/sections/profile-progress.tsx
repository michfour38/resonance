export function ProfileProgress() {
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
            Journey Progress
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10">
          <div className="grid gap-10 md:grid-cols-[1fr_320px] md:items-center">
            <div>
              <h3 className="text-2xl font-light text-zinc-100">
                Reflective progression remains self-led.
              </h3>

              <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400">
                Oremea journeys are designed around structured
                awareness rather than forced daily engagement.
                Users progress through reflection, observation,
                and synthesis at their own pace.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                    Current Journey
                  </p>

                  <p className="mt-3 text-lg text-zinc-200">
                    Resonance
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                    Expanded Recognition
                  </p>

                  <p className="mt-3 text-lg text-zinc-200">
                    Mirror Enabled
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200/10 bg-amber-100/[0.03] p-8">
              <p className="text-sm uppercase tracking-[0.18em] text-amber-100/70">
                Recommended Progression
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <div className="rounded-2xl border border-amber-200/20 bg-amber-100/[0.05] px-5 py-4 text-sm tracking-[0.16em] text-amber-100">
                  Resonance
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm tracking-[0.16em] text-zinc-300">
                  Compass
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm tracking-[0.16em] text-zinc-300">
                  Harmonize
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm tracking-[0.16em] text-zinc-300">
                  The Current
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}