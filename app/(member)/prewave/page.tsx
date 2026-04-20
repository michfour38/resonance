import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberWaveContext } from "@/src/lib/wave/wave.service";
import { getHoldingContent } from "@/src/lib/wave/wave.holding";
import {
  getPreWaveQuestions,
  getUnlockedPreWaveCount,
} from "@/src/lib/wave/prewave.service";
import {
  getPreWaveResponses,
  savePreWaveResponse,
} from "@/src/lib/wave/prewave-response.service";
import {
  getUserWaveNameVote,
  getWaveNameVoteCounts,
  saveWaveNameVote,
} from "@/src/lib/wave/wave-name-vote.service";
import { syncEntryAccessWindow } from "@/app/(marketing)/oremea/enter/actions";
import PreWavePromptCard from "./prewave-prompt-card";

export const dynamic = "force-dynamic";

type PreWavePageProps = {
  searchParams?: {
    pathway?: string;
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

export default async function PreWavePage({
  searchParams,
}: PreWavePageProps) {
  async function savePreWaveResponseAction(formData: FormData) {
    "use server";

    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
    }

    const cohortId = String(formData.get("cohortId") ?? "");
    const questionIndex = Number(formData.get("questionIndex"));
    const response = String(formData.get("response") ?? "").trim();
    const returnTo = String(formData.get("returnTo") ?? "/prewave");

    if (!cohortId || !questionIndex || !response) {
      redirect("/prewave");
    }

    await savePreWaveResponse(userId, cohortId, questionIndex, response);

    redirect(returnTo.startsWith("/") ? returnTo : "/prewave");
  }

  async function saveWaveNameVoteAction(formData: FormData) {
    "use server";

    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
    }

    const cohortId = String(formData.get("cohortId") ?? "");
    const waveName = String(formData.get("waveName") ?? "").trim();
    const returnTo = String(formData.get("returnTo") ?? "/prewave");

    if (!cohortId || !waveName) {
      redirect("/prewave");
    }

    await saveWaveNameVote(userId, cohortId, waveName);

    redirect(returnTo.startsWith("/") ? returnTo : "/prewave");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const entryAccess = await syncEntryAccessWindow();
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev && !entryAccess.hasAccess) {
    redirect("/oremea/enter");
  }

  const waveContext = await getMemberWaveContext(userId);
  const holdingContent = await getHoldingContent();
  const questions = getPreWaveQuestions();
  const responses = await getPreWaveResponses(userId, waveContext.wave.id);
  const existingVote = await getUserWaveNameVote(userId, waveContext.wave.id);
  const voteCounts = await getWaveNameVoteCounts(waveContext.wave.id);

  const unlockedCount = getUnlockedPreWaveCount(waveContext.wave.startsAt);
  const showJourneyUnlock = new Date() >= waveContext.wave.startsAt;

  const voted = searchParams?.voted === "1";

  const backgrounds = getPreWaveBackgrounds();
  const pathway =
    waveContext.membership.pathway ?? searchParams?.pathway ?? "discover";

  const mirrorTeaser =
    pathway === "relate"
      ? "Across what you’ve shared so far, there are already traces of how you move toward closeness, where you soften, and where you still protect. The Mirror becomes more accurate as your honesty deepens."
      : "Across what you’ve shared so far, there are already traces of what you long for, what you guard, and what may be ready to shift. The Mirror becomes more accurate as your honesty deepens.";

  const voteEntries = holdingContent.waveNameOptions.map((name) => ({
    name,
    count: voteCounts.get(name) ?? 0,
    selected: existingVote?.wave_name === name,
  }));

  const currentGroupFavorite =
    voteEntries.reduce<(typeof voteEntries)[number] | null>((leader, entry) => {
      if (!leader) return entry;
      if (entry.count > leader.count) return entry;
      return leader;
    }, null)?.count && voteEntries.some((entry) => entry.count > 0)
      ? voteEntries.reduce<(typeof voteEntries)[number] | null>(
          (leader, entry) => {
            if (!leader) return entry;
            if (entry.count > leader.count) return entry;
            return leader;
          },
          null
        )?.name ?? "Not chosen yet"
      : "Not chosen yet";

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

          <div className="mt-8 rounded-3xl border border-zinc-800/90 bg-black/45 p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Your Wave
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {waveContext.wave.name}
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-zinc-400">
              CURRENT GROUP FAVORITE:{" "}
              <span className="text-[#f1dfb4]">{currentGroupFavorite}</span>
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {questions.map((question, index) => {
              const questionNumber = index + 1;
              const unlocked = questionNumber <= unlockedCount;
              const existingResponse =
                responses.get(questionNumber)?.response ?? "";

              return (
                <PreWavePromptCard
                  key={questionNumber}
                  cohortId={waveContext.wave.id}
                  questionNumber={questionNumber}
                  question={question}
                  unlocked={unlocked}
                  existingResponse={existingResponse}
                  pathway={pathway}
                  onSave={savePreWaveResponseAction}
                />
              );
            })}
          </div>

          <div className="mt-8 rounded-3xl border border-zinc-800/90 bg-black/45 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Wave name vote
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              Vote for your Wave name
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {voteEntries.map((option) => (
                <form key={option.name} action={saveWaveNameVoteAction}>
                  <input type="hidden" name="cohortId" value={waveContext.wave.id} />
                  <input type="hidden" name="waveName" value={option.name} />
                  <input
                    type="hidden"
                    name="returnTo"
                    value={`/prewave?pathway=${pathway}&voted=1`}
                  />

                  <button
                    type="submit"
                    className={`w-full rounded-2xl border px-4 py-4 text-sm transition ${
                      option.selected
                        ? "border-[#c8a96a]/60 bg-[#c8a96a]/10 text-[#f1dfb4]"
                        : "border-white/10 bg-black/20 text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>{option.name}</span>
                      <span className="text-xs text-zinc-400">{option.count}</span>
                    </div>
                  </button>
                </form>
              ))}
            </div>

            {voted ? (
              <p className="mt-4 text-xs text-[#f1dfb4]">Vote saved.</p>
            ) : null}
          </div>

          <div className="mt-8 rounded-3xl border border-zinc-800/90 bg-black/45 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Early Mirror
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              The Mirror is beginning to listen
            </h2>

            <p className="mt-5 text-base leading-8 text-zinc-200">
              {mirrorTeaser}
            </p>

            <p className="mt-4 text-sm leading-7 text-zinc-400">
              What you are seeing here is not the full Mirror.
              It is only the first sign that your reflections can begin to form
              a deeper pattern over time.
            </p>
          </div>

          {showJourneyUnlock ? (
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
                Your Journey includes one full Mirror reflection at the end —
                a deeper synthesis of your patterns, contradictions, and growth
                across everything you’ve shared.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`/journey/unlock?pathway=${pathway}`}
                  className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10"
                >
                  Continue to Journey
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}