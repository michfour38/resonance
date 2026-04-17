type MirrorUnlockPageProps = {
  searchParams?: {
    weekNumber?: string;
    dayNumber?: string;
    tier?: string;
  };
};

const PAYSTACK_MIRROR_URL = "https://paystack.shop/pay/r6u8o3lbqf";

export default function MirrorUnlockPage({
  searchParams,
}: MirrorUnlockPageProps) {
  const weekNumber = searchParams?.weekNumber ?? "";
  const dayNumber = searchParams?.dayNumber ?? "";
  const tier = searchParams?.tier ?? "full";

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: "url(/images/desktop/bg-mirror.webp)" }}
      />

      <div
        className="fixed inset-0 z-0 block bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url(/images/mobile/bg-mirror.webp)" }}
      />

      <div className="fixed inset-0 z-10 bg-black/55" />

      <div className="relative z-20">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px]">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Mirror Unlock
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-white">
              {tier === "full" ? "Unlock Full Mirror" : "Unlock Lite Mirror"}
            </h1>

            <p className="mt-4 text-base leading-7 text-zinc-300">
              You’re unlocking the deeper Mirror layer — a more continuous
              reflection of the patterns, contradictions, and emerging truths
              running through what you share.
            </p>

            <p className="mt-4 text-base leading-7 text-zinc-300">
              After payment, you’ll return directly to your Journey and the
              Mirror unlock will be applied automatically.
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              Week {weekNumber || "—"} · Day {dayNumber || "—"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={PAYSTACK_MIRROR_URL}
                className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] hover:bg-[#c8a96a]/10"
              >
                Continue to payment
              </a>

              <a
                href="/journey"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
              >
                Return to Journey
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}