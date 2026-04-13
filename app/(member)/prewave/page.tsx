export const dynamic = "force-dynamic";

type PreWavePageProps = {
  searchParams?: {
    pathway?: string;
  };
};

function getPreWaveBackground() {
  return "/images/bg-prewave.png";
}

export default function PreWavePage({ searchParams }: PreWavePageProps) {
  const pathway =
    searchParams?.pathway === "discover" || searchParams?.pathway === "relate"
      ? searchParams.pathway
      : null;

  const journeyHref = pathway
    ? `/journey/unlock?pathway=${pathway}`
    : "/journey/unlock";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src={getPreWaveBackground()}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-[2rem] border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px] md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Pre-Wave
          </p>

          <h1 className="mt-4 text-4xl font-semibold text-white">
            Before your Wave begins
          </h1>

          <p className="mt-5 text-lg text-zinc-200">
            Your Pre-Wave space is live. We are finishing the last connected
            systems behind the scenes.
          </p>

          <div className="mt-10 rounded-3xl border border-zinc-800/90 bg-black/45 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Current status
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              Your journey is preparing
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              The full Pre-Wave reflection flow is being finalized. You can
              continue now into the Journey unlock step.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={journeyHref}
                className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] hover:bg-[#c8a96a]/10"
              >
                Continue to Journey Unlock
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}