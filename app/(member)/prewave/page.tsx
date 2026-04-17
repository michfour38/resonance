export const dynamic = "force-dynamic";

type PreWavePageProps = {
  searchParams?: {
    pathway?: string;
  };
};

function getPreWaveBackgrounds() {
  return {
    desktop: "/images/desktop/bg-prewave.webp",
    mobile: "/images/mobile/bg-prewave.webp",
  };
}

export default function PreWavePage({ searchParams }: PreWavePageProps) {
  const pathway =
    searchParams?.pathway === "discover" || searchParams?.pathway === "relate"
      ? searchParams.pathway
      : null;

  const journeyHref = pathway
    ? `/journey/unlock?pathway=${pathway}`
    : "/journey/unlock";

  const backgrounds = getPreWaveBackgrounds();

  const mirrorIntro =
    pathway === "relate"
      ? "Something is already becoming visible in how you move toward connection."
      : "Something is already becoming visible in what you are beginning to see more clearly within yourself.";

  const mirrorBody =
    pathway === "relate"
      ? "Across what you’ve shared so far, there are early signs of pattern, openness, and self-protection beginning to take shape. This is only a glimpse of what becomes clearer when your reflections are held across time."
      : "Across what you’ve shared so far, there are early signs of pattern, tension, and emerging truth beginning to take shape. This is only a glimpse of what becomes clearer when your reflections are held across time.";

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${backgrounds.desktop})` }}
      />

      <div
        className="fixed inset-0 z-0 block bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${backgrounds.mobile})` }}
      />

      <div className="pointer-events-none fixed inset-0 z-10 bg-black/45" />

      <div className="relative z-20 mx-auto max-w-4xl px-6 py-12 md:py-16">
        <div className="rounded-[2rem] border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px] md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Pre-Wave
          </p>

          <h1 className="mt-4 text-4xl font-semibold text-white">
            Before your Wave begins
          </h1>

          <p className="mt-5 text-lg leading-8 text-zinc-200">
            This is the threshold before the full journey opens. What you’ve
            shared already begins to form an early reflection of what may want
            to be seen more clearly.
          </p>

          <div className="mt-10 rounded-3xl border border-zinc-800/90 bg-black/45 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Early Mirror
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              Something is already forming
            </h2>

            <p className="mt-5 text-base leading-8 text-zinc-200">
              {mirrorIntro}
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-300">
              {mirrorBody}
            </p>

            <p className="mt-4 text-sm leading-7 text-zinc-500">
              This is only an early glimpse. Deeper reflection becomes possible
              as your journey continues.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-[#c8a96a]/35 bg-[#c8a96a]/10 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#f1dfb4]/80">
              Journey
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              Enter Your Full 10-Week Resonance Journey
            </h2>

            <p className="mt-4 text-base leading-8 text-zinc-100">
              Continue beyond Pre-Wave into a structured 10-week relational
              journey designed to deepen how you understand yourself and connect
              with others.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-200">
              Move through guided weekly rooms, daily reflections, and
              progressively deeper inquiry into patterns, attraction, emotional
              triggers, communication, and relational truth.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-200">
              Your Journey includes one deeper Mirror reflection at the end,
              drawing together what you’ve shared into a fuller synthesis of
              your patterns, growth, and direction.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={journeyHref}
                className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10"
              >
                Unlock Your Journey
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}