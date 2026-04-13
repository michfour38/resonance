type JourneyPageProps = {
  searchParams?: {
    payment?: string;
  };
};

export default function JourneyPage({ searchParams }: JourneyPageProps) {
  const paymentSuccess = searchParams?.payment === "success";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src="/images/bg-prewave.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/50" />

      <div className="relative z-10">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px]">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Resonance Journey
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-white">
              Welcome to your Journey
            </h1>

            <p className="mt-4 text-base leading-7 text-zinc-300">
              Your access is active. This is your live post-payment landing page.
            </p>

            {paymentSuccess && (
              <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4 text-sm text-emerald-100">
                Payment received successfully. Your Journey is now unlocked.
              </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <a
                href="/prewave"
                className="rounded-2xl border border-zinc-700 bg-black/30 p-5 hover:bg-black/45"
              >
                <p className="text-sm font-medium text-white">Pre-Wave</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Return to your current preparation space.
                </p>
              </a>

              <a
                href="/mirror/unlock"
                className="rounded-2xl border border-zinc-700 bg-black/30 p-5 hover:bg-black/45"
              >
                <p className="text-sm font-medium text-white">Mirror</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Continue into the Mirror unlock flow.
                </p>
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/30 p-5">
              <p className="text-sm text-zinc-300">
                The full in-Journey experience can now be layered in here without
                affecting your payment flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}