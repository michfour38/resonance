type JourneyUnlockPageProps = {
  searchParams?: {
    pathway?: string;
  };
};

const PAYSTACK_JOURNEY_URL = "https://paystack.shop/pay/lb1u1x7afq";

export default function JourneyUnlockPage({
  searchParams,
}: JourneyUnlockPageProps) {
  const pathway =
    searchParams?.pathway === "discover" || searchParams?.pathway === "relate"
      ? searchParams.pathway
      : null;

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: "url(/images/desktop/bg-prewave.webp)" }}
      />

      <div
        className="fixed inset-0 z-0 block bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url(/images/mobile/bg-prewave.webp)" }}
      />

      <div className="fixed inset-0 z-10 bg-black/55" />

      <div className="relative z-20">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px]">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Journey
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-white">
              Enter Your Full 10-Week Resonance Journey
            </h1>

            <p className="mt-5 text-base leading-8 text-zinc-200">
              You’ve already begun to see something take shape.
              The Journey is where that becomes clear.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-300">
              Across 10 weeks, you’ll move through guided relational spaces —
              each one designed to reveal how you relate, respond, protect,
              open, and connect.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-300">
              This is not content. It is a structured experience.
              You reflect daily. You begin to notice patterns.
              You begin to understand yourself in motion.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-300">
              Your Journey includes one full Mirror reflection at the end —
              a deeper synthesis of your patterns, contradictions, and growth
              across everything you’ve shared.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={PAYSTACK_JOURNEY_URL}
                className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] hover:bg-[#c8a96a]/10"
              >
                Continue to payment — R520
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