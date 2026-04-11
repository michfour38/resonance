import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Script from "next/script";

import { prisma } from "@/lib/prisma";
import { getHoldingContent } from "../../../src/lib/wave/wave.holding";
import {
  getPreWaveQuestions,
  getUnlockedPreWaveCount,
} from "../../../src/lib/wave/prewave.service";
import {
  getUserWaveNameVote,
  getWaveNameVoteCounts,
} from "../../../src/lib/wave/wave-name-vote.service";
import { getPreWaveResponses } from "../../../src/lib/wave/prewave-response.service";
import { getMemberWaveContext } from "../../../src/lib/wave/wave.service";
import MemberNav from "../member-nav";

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

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() ?? null;

  if (email) {
    try {
      await prisma.entry_leads.upsert({
        where: { email },
        update: {
          entered_journey_at: new Date(),
          ...(requestedPathway ? { pathway: requestedPathway } : {}),
        },
        create: {
          email,
          entered_journey_at: new Date(),
          ...(requestedPathway ? { pathway: requestedPathway } : {}),
        },
      });
    } catch (error) {
      console.error("Prewave entry tracking failed:", error);
    }
  }

  const context = await getMemberWaveContext(userId);

  if (requestedPathway && context.membership.pathway !== requestedPathway) {
    try {
      await prisma.cohort_members.update({
        where: { id: context.membership.id },
        data: { pathway: requestedPathway },
      });
    } catch (error) {
      console.error("Prewave pathway persistence failed:", error);
    }
  }

  const effectivePathway =
    requestedPathway ??
    (context.membership.pathway === "discover" ||
    context.membership.pathway === "relate"
      ? context.membership.pathway
      : null);

  const holding = await getHoldingContent();
  const preWaveQuestions = getPreWaveQuestions();
  const preWaveBackground = getPreWaveBackground();

  const now = new Date();
  const waveStartDate = new Date(context.wave.startsAt);

  const unlockedCount = getUnlockedPreWaveCount(waveStartDate, now);
  const visibleQuestions = preWaveQuestions.slice(0, unlockedCount);

  const userVote = await getUserWaveNameVote(userId, context.wave.id);
  const voteCounts = await getWaveNameVoteCounts(context.wave.id);
  const responses = await getPreWaveResponses(userId, context.wave.id);

  const answeredCount = Array.from({ length: 6 }, (_, i) => {
    const saved = responses.get(i + 1);
    return Boolean(saved?.response?.trim());
  }).filter(Boolean).length;

  const hasVoted = Boolean(userVote?.wave_name);
  const isComplete = answeredCount === 6 && hasVoted;

  const completedSteps = answeredCount + (hasVoted ? 1 : 0);
  const totalSteps = 7;

  const progressRatio = completedSteps / totalSteps;
  const progressPercent = Math.max(8, progressRatio * 100);

  const waveStartDisplay = waveStartDate.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const journeyHref = effectivePathway
    ? `/journey/unlock?pathway=${effectivePathway}`
    : "/journey/unlock";

  const rankedWaveOptions = holding.waveNameOptions.map((option) => ({
    option,
    votes: voteCounts.get(option) ?? 0,
  }));

  const highestVoteCount = rankedWaveOptions.reduce(
    (max, item) => Math.max(max, item.votes),
    0
  );

  const displayWaveName =
    highestVoteCount > 0
      ? rankedWaveOptions.find((item) => item.votes === highestVoteCount)
          ?.option ?? context.wave.name
      : context.wave.name;

  const showJourneyCard = isComplete && now >= waveStartDate;

  return (
    <>
      {showJourneyCard && (
        <Script id="prewave-auto-scroll" strategy="afterInteractive">
          {`
            window.requestAnimationFrame(() => {
              setTimeout(() => {
                const scrollContainer = document.querySelector(".prewave-scroll");
                if (scrollContainer) {
                  scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: "smooth"
                  });
                }
              }, 350);
            });
          `}
        </Script>
      )}

      <main className="relative h-screen overflow-hidden bg-black text-white">
        <style>{`
          .prewave-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .prewave-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <img
          src={preWaveBackground}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="prewave-scroll relative z-10 h-full overflow-y-auto">
          <MemberNav />
          <div className="mx-auto max-w-4xl px-6 py-12">
            <div className="rounded-[2rem] border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px] md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Pre-Wave
              </p>

              <h1 className="mt-4 text-4xl font-semibold text-white">
                {holding.title}
              </h1>

              <p className="mt-5 text-lg text-zinc-200">{holding.description}</p>

              <div className="mt-10 rounded-3xl border border-zinc-800/90 bg-black/45 p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Your Wave
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {displayWaveName}
                </h2>

                <p className="mt-3 text-sm text-zinc-400">
                  Current group favourite
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  This may shift as more members vote.
                </p>

                <div className="mt-4 space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    Begins
                  </p>
                  <p className="text-sm text-zinc-200">{waveStartDisplay}</p>
                </div>

                <div className="mt-5 h-[2px] w-full rounded-full bg-zinc-800/90">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progressPercent}%`,
                      background:
                        "linear-gradient(90deg, rgba(113,113,122,0.98) 0%, rgba(161,161,170,0.9) 78%, rgba(34,197,94,0.38) 100%)",
                    }}
                  />
                </div>

                <p className="mt-4 text-sm text-zinc-400">
                  Your Wave is beginning to take shape.
                </p>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-3xl border border-zinc-700/90 bg-black/45 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Opening questions
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    Before your Wave begins
                  </h2>

                  <div className="mt-6 space-y-4">
                    {visibleQuestions.map((question, index) => {
                      const i = index + 1;
                      const saved = responses.get(i);
                      const isAnswered = Boolean(saved?.response?.trim());

                      return (
                        <div
                          key={i}
                          className={`rounded-2xl border p-6 ${
                            isAnswered
                              ? "border-amber-400/35 bg-black/40"
                              : "border-zinc-700/90 bg-black/35"
                          }`}
                        >
                          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                            Question {i}
                          </p>

                          <p className="mt-3 text-base leading-7 text-zinc-200">
                            {question}
                          </p>

                          <form
                            action="/api/prewave-response"
                            method="POST"
                            className="mt-5 space-y-4"
                          >
                            <input
                              type="hidden"
                              name="cohortId"
                              value={context.wave.id}
                            />
                            <input
                              type="hidden"
                              name="questionIndex"
                              value={i}
                            />

                            <textarea
                              name="response"
                              defaultValue={saved?.response ?? ""}
                              rows={3}
                              placeholder="Write your reflection..."
                              className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950/90 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
                            />

                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="rounded-xl bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
                              >
                                {isAnswered ? "Completed" : "Reflect"}
                              </button>
                            </div>
                          </form>
                        </div>
                      );
                    })}

                    {unlockedCount < 6 && (
                      <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/30 p-5">
                        <p className="text-sm text-zinc-400">
                          Something is already unfolding here.
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                          Your next question will open tomorrow.
                        </p>
                      </div>
                    )}

                    {showJourneyCard && (
                      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-5">
                        <p className="text-sm text-emerald-100">
                          Your Pre-Wave is complete.
                        </p>

                        <div className="mt-4">
                          <a
                            href={journeyHref}
                            className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] hover:bg-[#c8a96a]/10"
                          >
                            Enter Journey
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <div className="space-y-6">
                  <section className="rounded-3xl border border-zinc-700/90 bg-black/45 p-6">
                    <p className="text-xs uppercase text-zinc-500">
                      Wave naming
                    </p>

                    <h2 className="mt-3 text-xl font-semibold text-white">
                      Choose from the current Wave name options
                    </h2>

                    <p className="mt-3 text-sm text-zinc-400">
                      Choose a name that feels true to your experience
                    </p>

                    <div className="mt-5 space-y-3">
                      {holding.waveNameOptions.map((option) => {
                        const isSelected = userVote?.wave_name === option;
                        const count = voteCounts.get(option) ?? 0;

                        return (
                          <a
                            key={option}
                            href={`/api/wave-name-vote?cohortId=${encodeURIComponent(
                              context.wave.id
                            )}&waveName=${encodeURIComponent(option)}`}
                            className={`block rounded-2xl border px-4 py-4 ${
                              isSelected
                                ? "border-amber-300/40 bg-amber-400/[0.06] text-amber-100"
                                : "border-zinc-800 bg-black/30 text-zinc-200 hover:border-zinc-700 hover:bg-black/45"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p className="min-w-0 text-sm">{option}</p>
                              <p className="shrink-0 text-xs text-zinc-500">
                                {count} vote{count === 1 ? "" : "s"}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </section>

                  <section className="relative overflow-hidden rounded-3xl border border-zinc-700/90 bg-black/45 p-6">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
                      <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-white blur-3xl" />
                    </div>

                    <div className="relative z-10">
                      <p className="text-xs uppercase text-zinc-500">Mirror</p>

                      <h2 className="mt-3 text-xl font-semibold text-white">
                        Your Mirror is part of this journey
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-zinc-400">
                        A deeper reflection will become available as your journey
                        unfolds.
                      </p>

                      <div className="mt-5 rounded-2xl border border-zinc-700 bg-black/30 p-5">
                        <p className="text-sm text-zinc-300">
                          Something deeper is waiting here.
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                          As you move through the Wave, this space will open into a
                          more personal reflection.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}