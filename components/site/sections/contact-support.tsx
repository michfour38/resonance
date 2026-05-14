export function ContactSupport() {
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-amber-200/10 bg-amber-100/[0.03] p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-amber-100/70">
              Support
            </p>

            <h2 className="mt-4 text-3xl font-light text-zinc-100">
              Contact Oremea
            </h2>

            <p className="mt-6 text-base leading-8 text-zinc-400">
              For account access, payment support, product questions,
              or platform-related assistance, please email:
            </p>

            <a
              href="mailto:support@oremea.com"
              className="mt-8 inline-flex rounded-full border border-amber-200/20 bg-amber-100/[0.05] px-5 py-3 text-sm tracking-[0.16em] text-amber-100 transition hover:border-amber-100/50 hover:bg-amber-100/[0.08]"
            >
              support@oremea.com
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
              Response Scope
            </p>

            <div className="mt-6 space-y-6 text-base leading-8 text-zinc-400">
              <p>
                Oremea support can assist with account access,
                payment questions, product navigation,
                and technical platform issues.
              </p>

              <p>
                Oremea does not provide therapy, crisis support,
                medical treatment, or emergency services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}