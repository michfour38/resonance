import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberWaveContext } from "../../../src/lib/wave/wave.service";

export const dynamic = "force-dynamic";

function getPreWaveBackground() {
  return "/images/bg-prewave.png";
}

type PreWavePageProps = {
  searchParams?: {
    pathway?: string;
  };
};

export default async function PreWavePage({
  searchParams,
}: PreWavePageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const requestedPathway =
    searchParams?.pathway === "discover" || searchParams?.pathway === "relate"
      ? searchParams.pathway
      : null;

  const context = await getMemberWaveContext(userId);
  const preWaveBackground = getPreWaveBackground();

  const waveStartDate = new Date(context.wave.startsAt);

  const waveStartDisplay = waveStartDate.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const effectivePathway =
    requestedPathway ??
    (context.membership.pathway === "discover" ||
    context.membership.pathway === "relate"
      ? context.membership.pathway
      : null);

  const journeyHref = effectivePathway
    ? `/journey/unlock?pathway=${effectivePathway}`
    : "/journey/unlock";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src={preWaveBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-[2rem] border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px] md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Pre-Wave
          </p>

          <h1 className="mt-4 text-4xl font-semibold text-white">
            Before your Wave begins
          </h1>

          <p className="mt-5 text-lg text-zinc-200">
            Your space is being prepared. This simplified live version is active
            while we finish connecting the remaining Pre-Wave systems.
          </p>

          <div className="mt-10 rounded-3xl border border-zinc-800/90 bg-black/45 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Your Wave
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              {context.wave.name}
            </h2>

            <div className="mt-4 space-y-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Begins
              </p>
              <p className="text-sm text-zinc-200">{waveStartDisplay}</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-zinc-700/90 bg-black/45 p-6">
            <h3 className="text-xl font-semibold text-white">
              Opening reflection
            </h3>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              The full Pre-Wave question flow is being finalized. For now, you
              can continue into the Journey unlock flow below.
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