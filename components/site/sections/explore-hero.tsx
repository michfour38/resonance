export function ExploreHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_45%)]" />

      <div className="relative mx-auto max-w-4xl px-5 py-28 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.32em] text-amber-200/70">
          Explore Oremea
        </p>

        <h1 className="mx-auto max-w-3xl text-4xl font-light leading-tight text-zinc-100 md:text-6xl">
          Structured awareness systems for relationships,
          direction, communication, and intentional connection.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
          Self-guided reflective frameworks supported by expanded
          recognition tools.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/compare"
            className="rounded-full border border-amber-200/30 bg-amber-100/10 px-6 py-3 text-sm uppercase tracking-[0.18em] text-amber-100 transition hover:border-amber-100/60 hover:bg-amber-100/15"
          >
            Compare Products
          </a>

          <a
            href="/enter"
            className="rounded-full border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.18em] text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            Enter Oremea
          </a>
        </div>
      </div>
    </section>
  );
}