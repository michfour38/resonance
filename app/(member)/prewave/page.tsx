import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PreWavePageProps = {
  searchParams?: {
    pathway?: string;
    step?: string;
    saved?: string;
    voted?: string;
  };
};

function getPreWaveBackgrounds() {
  return {
    desktop: "/images/desktop/bg-prewave.webp",
    mobile: "/images/mobile/bg-prewave.webp",
  };
}

const PREWAVE_QUESTIONS = [
  "What do you most hope this journey might help you understand more clearly about yourself?",
  "What kind of connection are you most longing for in your life right now?",
  "What do you think people often misunderstand about you at first?",
  "What tends to make you feel more open, and what tends to make you pull back?",
  "What are you hoping to experience differently in the way you relate going forward?",
  "What already feels like it may be shifting in you, even before the journey fully begins?",
] as const;

async function getActiveCohortId(userId: string): Promise<string | null> {
  const membership = await prisma.cohort_members.findFirst({
    where: {
      user_id: userId,
      status: { in: ["enrolled", "active"] },
    },
    select: {
      cohort_id: true,
    },
  });

  return membership?.cohort_id ?? null;
}

export default async function PreWavePage({
  searchParams,
}: PreWavePageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const pathway =
    searchParams?.pathway === "discover" || searchParams?.pathway === "relate"
      ? searchParams.pathway
      : "discover";

  const stepParam = Number(searchParams?.step ?? "1");
  const step = Number.isFinite(stepParam)
    ? Math.min(Math.max(stepParam, 1), 8)
    : 1;

  const saved = searchParams?.saved === "1";
  const voted = searchParams?.voted === "1";

  const cohortId = await getActiveCohortId(userId);

  const backgrounds = getPreWaveBackgrounds();

  const journeyHref = pathway
    ? `/journey/unlock?pathway=${pathway}`
    : "/journey/unlock";

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
            This is the threshold before the full journey opens.
          </p>

          {!cohortId ? (
            <div className="mt-10 rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
              <p className="text-sm leading-7 text-red-100">
                No active Wave enrollment was found for your account yet.
              </p>
              <p className="mt-2 text-sm leading-7 text-red-200/80">
                Pre-Wave responses and Wave voting need an active cohort
                membership to save correctly.
              </p>
            </div>
          ) : null}

          {step <= 6 && (
            <div className="mt-10 rounded-3xl border border-zinc-800/90 bg-black/45 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Reflection {step} of 6
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                {PREWAVE_QUESTIONS[step - 1]}
              </h2>

              {saved ? (
                <p className="mt-4 text-sm text-[#f1dfb4]">
                  Reflection saved.
                </p>
              ) : null}

              <form
                action="/api/prewave-response"
                method="POST"
                className="mt-6 space-y-4"
              >
                <input type="hidden" name="cohortId" value={cohortId ?? ""} />
                <input type="hidden" name="questionIndex" value={step} />
                <input
                  type="hidden"
                  name="returnTo"
                  value={`/prewave?pathway=${pathway}&step=${Math.min(step + 1, 7)}&saved=1`}
                />

                <textarea
                  name="response"
                  rows={6}
                  required
                  className="w-full resize-none rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#c8a96a]/30"
                  placeholder="Write what feels true..."
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={!cohortId}
                    className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Save and continue
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 7 && (
            <div className="mt-10 rounded-3xl border border-zinc-800/90 bg-black/45 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Wave name
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                What name feels true for this Wave?
              </h2>

              <p className="mt-4 text-base leading-8 text-zinc-300">
                Your seeded Journey rooms stay the same. This vote shapes the
                dynamic name of your Wave, not the room titles themselves.
              </p>

              {voted ? (
                <p className="mt-4 text-sm text-[#f1dfb4]">
                  Wave name vote saved.
                </p>
              ) : null}

              <form
                action="/api/wave-name-vote"
                method="GET"
                className="mt-6 space-y-4"
              >
                <input type="hidden" name="cohortId" value={cohortId ?? ""} />
                <input type="hidden" name="pathway" value={pathway} />
                <input
                  type="hidden"
                  name="returnTo"
                  value={`/prewave?pathway=${pathway}&step=8&voted=1`}
                />

                <input
                  type="text"
                  name="waveName"
                  required
                  className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#c8a96a]/30"
                  placeholder="Enter the Wave name you want to vote for..."
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={!cohortId}
                    className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Save Wave name vote
                  </button>
                </div>
              </form>
            </div>
          )}

          {step >= 8 && (
            <>
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
                  This is only an early glimpse. Deeper reflection becomes
                  possible as your journey continues.
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
                  journey designed to deepen how you understand yourself and
                  connect with others.
                </p>

                <p className="mt-4 text-base leading-8 text-zinc-200">
                  Move through guided weekly rooms, daily reflections, and
                  progressively deeper inquiry into patterns, attraction,
                  emotional triggers, communication, and relational truth.
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}