export function ProfileHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-5xl px-5 py-24">
        <p className="mb-5 text-xs uppercase tracking-[0.28em] text-amber-200/70">
          Profile
        </p>

        <h1 className="max-w-3xl text-4xl font-light leading-tight text-zinc-100 md:text-6xl">
          Your access, progress, and participation across Oremea.
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-8 text-zinc-400">
          A central place for account details, active products,
          reflective progression, support, and ecosystem access.
        </p>
      </div>
    </section>
  );
}