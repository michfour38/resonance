type MirrorUnlockPageProps = {
  searchParams?: {
    weekNumber?: string;
    dayNumber?: string;
    tier?: string;
  };
};

const PAYSTACK_MIRROR_URL = "https://paystack.shop/pay/wx9avyp3-t";

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
              Mirror
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-white">
              {tier === "full" ? "Unlock the Full Mirror" : "Unlock the Lite Mirror"}
            </h1>

            <p className="mt-5 text-base leading-8 text-zinc-200">
              Mirror is the deeper reflective layer woven through your full Journey.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-300">
              Instead of only receiving one synthesis at the end, you begin receiving
              deeper pattern-based reflections throughout the 10 weeks — across what
              you share, what repeats, what contradicts itself, what softens, and
              what is slowly becoming more honest over time.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-300">
              The more truthfully you reflect, the more precisely Mirror can reflect
              back to you. This is where themes, emotional loops, inner tensions,
              protective strategies, and emerging growth begin to become visible
              while you are still inside the journey — not only after it.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-300">
              This unlock gives you Mirror access across your full 10-week Journey.
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              Week {weekNumber || "—"} · Day {dayNumber || "—"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={PAYSTACK_MIRROR_URL}
                className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] hover:bg-[#c8a96a]/10"
              >
                Continue to payment — R720
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