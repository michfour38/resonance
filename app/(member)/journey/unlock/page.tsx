type JourneyUnlockPageProps = {
  searchParams?: {
    pathway?: string;
  };
};

export default function JourneyUnlockPage({
  searchParams,
}: JourneyUnlockPageProps) {
  const pathway =
    searchParams?.pathway === "discover" || searchParams?.pathway === "relate"
      ? searchParams.pathway
      : null;

  const paystackUrl = process.env.PAYSTACK_JOURNEY_URL;

  if (!paystackUrl) {
    return (
      <main className="relative min-h-screen bg-black text-white">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800/90 bg-black/55 p-6">
            <h1 className="text-white">Payment link not configured</h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src="/images/bg-prewave.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/50" />

      <div className="relative z-10">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px]">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Journey Unlock
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-white">
              Unlock the full Resonance Journey
            </h1>

            <p className="mt-4 text-base leading-7 text-zinc-300">
              This unlock gives you full access to the 10-week Journey and the Lite Mirror layer.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={paystackUrl}
                className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] hover:bg-[#c8a96a]/10"
              >
                Continue to payment
              </a>

              <a
                href={pathway ? `/prewave?pathway=${pathway}` : "/prewave"}
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
              >
                Return to Pre-Wave
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}