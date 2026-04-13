import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentDayContent } from "@/app/(member)/journey/journey.service";

export const dynamic = "force-dynamic";

type JourneyPageProps = {
  searchParams?: {
    payment?: string;
  };
};

export default async function JourneyPage({
  searchParams,
}: JourneyPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const content = await getCurrentDayContent(userId);

  if (!content) {
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
                Your Journey is almost ready
              </h1>

              <p className="mt-4 text-base leading-7 text-zinc-300">
                We could not find today’s Journey content yet.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/prewave"
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

  const paymentSuccess = searchParams?.payment === "success";
  const firstPrompt = content.prompts[0] ?? null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src="/images/bg-prewave.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/50" />

      <div className="relative z-10">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px]">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Resonance Journey
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-white">
              {content.weekTitle}
            </h1>

            <p className="mt-3 text-sm text-zinc-400">
              Week {content.weekNumber} · Day {content.dayNumber}
            </p>

            <p className="mt-4 text-base leading-7 text-zinc-300">
              {content.weekTheme}
            </p>

            {paymentSuccess && (
              <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4 text-sm text-emerald-100">
                Payment received successfully. Your Journey is now unlocked.
              </div>
            )}

            {firstPrompt ? (
              <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Today’s first prompt
                </p>

                <p className="mt-4 text-lg leading-8 text-zinc-100">
                  {firstPrompt.content}
                </p>

                {firstPrompt.response && (
                  <div className="mt-6 rounded-2xl border border-zinc-700 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Your latest response
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                      {firstPrompt.response}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/prewave"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
                  >
                    Return to Pre-Wave
                  </a>

                  <a
                    href="/mirror/unlock"
                    className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] hover:bg-[#c8a96a]/10"
                  >
                    Mirror
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/30 p-5">
                <p className="text-sm text-zinc-300">
                  No prompt is available for today yet.
                </p>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/30 p-5">
              <p className="text-sm text-zinc-300">
                This is now connected to the real Journey content service and can
                be expanded into the full in-app reflection experience next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}