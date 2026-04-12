import { getProgressCounterForUser } from "../../../src/lib/progress/progress-counter.service";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Script from "next/script";

import { prisma } from "@/lib/prisma";
import { getMemberWaveContext } from "../../../src/lib/wave/wave.service";
import {
  isFullMirrorEligible,
  isLiteMirrorEligible,
} from "../../../src/lib/wave/wave.mirror";
import { getCurrentDayContent } from "../../../src/lib/journey/getCurrentDayContent";
import {
  getPromptThread,
  PromptThreadDTO,
  getDiscoverReadinessSignal,
} from "./journey.service";

import { getMirrorHistory } from "../mirror/mirror.service";
import { isMirrorTierUnlocked } from "../mirror/mirror-unlock.service";

import PromptCard from "./prompt-card";
import MirrorCard from "./mirror-card";
import MirrorOutput from "../mirror/mirror-output";

export const dynamic = "force-dynamic";

type JourneyPageProps = {
  searchParams?: {
    pathway?: string;
  };
};

function getJourneyBackground(
  phase: string,
  weekNumber: number | null | undefined
) {
  if (phase === "COMPLETED") {
    return "/images/bg-collective-pool.png";
  }

  if (weekNumber === 9) {
    return "/images/bg-the-gathering.png";
  }

  if (weekNumber === 10) {
    return "/images/bg-the-becoming.png";
  }

  const roomBackgroundMap: Record<number, string> = {
    1: "/images/bg-hearth.png",
    2: "/images/bg-mirror.png",
    3: "/images/bg-garden.png",
    4: "/images/bg-compass.png",
    5: "/images/bg-pulse.png",
    6: "/images/bg-shadow.png",
    7: "/images/bg-forge.png",
    8: "/images/bg-vision.png",
  };

  return weekNumber
    ? roomBackgroundMap[weekNumber] ?? "/images/bg-hearth.png"
    : "/images/bg-hearth.png";
}

function getJourneyOverlayStyle(
  phase: string,
  weekNumber: number | null | undefined
) {
  if (phase === "COMPLETED") {
    return {
      background:
        "radial-gradient(circle at top, rgba(34,44,52,0.14) 0%, rgba(10,10,10,0.34) 42%, rgba(0,0,0,0.68) 100%), linear-gradient(to bottom, rgba(0,0,0,0.14), rgba(0,0,0,0.4), rgba(0,0,0,0.62))",
    };
  }

  if (weekNumber === 9) {
    return {
      background:
        "radial-gradient(circle at top, rgba(48,38,28,0.16) 0%, rgba(12,12,12,0.34) 42%, rgba(0,0,0,0.66) 100%), linear-gradient(to bottom, rgba(0,0,0,0.16), rgba(0,0,0,0.38), rgba(0,0,0,0.58))",
    };
  }

  if (weekNumber === 10) {
    return {
      background:
        "radial-gradient(circle at top, rgba(30,34,40,0.15) 0%, rgba(12,12,12,0.34) 42%, rgba(0,0,0,0.66) 100%), linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.38), rgba(0,0,0,0.58))",
    };
  }

  const overlayMap: Record<number, { background: string }> = {
    1: {
      background:
        "radial-gradient(circle at top, rgba(68,48,28,0.16) 0%, rgba(10,10,10,0.34) 40%, rgba(0,0,0,0.66) 100%), linear-gradient(to bottom, rgba(0,0,0,0.16), rgba(0,0,0,0.36), rgba(0,0,0,0.56))",
    },
    2: {
      background:
        "radial-gradient(circle at top, rgba(42,44,64,0.16) 0%, rgba(10,10,10,0.36) 40%, rgba(0,0,0,0.68) 100%), linear-gradient(to bottom, rgba(0,0,0,0.16), rgba(0,0,0,0.4), rgba(0,0,0,0.6))",
    },
    3: {
      background:
        "radial-gradient(circle at top, rgba(38,58,36,0.15) 0%, rgba(10,10,10,0.34) 40%, rgba(0,0,0,0.66) 100%), linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.38), rgba(0,0,0,0.58))",
    },
    4: {
      background:
        "radial-gradient(circle at top, rgba(28,28,40,0.22) 0%, rgba(8,8,8,0.42) 40%, rgba(0,0,0,0.75) 100%), linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.45), rgba(0,0,0,0.7))",
    },
    5: {
      background:
        "radial-gradient(circle at top, rgba(72,30,34,0.16) 0%, rgba(10,10,10,0.35) 40%, rgba(0,0,0,0.67) 100%), linear-gradient(to bottom, rgba(0,0,0,0.16), rgba(0,0,0,0.39), rgba(0,0,0,0.59))",
    },
    6: {
      background:
        "radial-gradient(circle at top, rgba(22,24,34,0.17) 0%, rgba(8,8,8,0.38) 40%, rgba(0,0,0,0.72) 100%), linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.42), rgba(0,0,0,0.66))",
    },
    7: {
      background:
        "radial-gradient(circle at top, rgba(86,34,18,0.16) 0%, rgba(10,10,10,0.36) 40%, rgba(0,0,0,0.68) 100%), linear-gradient(to bottom, rgba(0,0,0,0.16), rgba(0,0,0,0.4), rgba(0,0,0,0.6))",
    },
    8: {
      background:
        "radial-gradient(circle at top, rgba(34,50,70,0.14) 0%, rgba(10,10,10,0.34) 40%, rgba(0,0,0,0.66) 100%), linear-gradient(to bottom, rgba(0,0,0,0.14), rgba(0,0,0,0.38), rgba(0,0,0,0.58))",
    },
  };

  return weekNumber
    ? overlayMap[weekNumber] ?? overlayMap[1]
    : overlayMap[1];
}

export default async function JourneyPage({
  searchParams,
}: JourneyPageProps) {
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
      console.error("Journey entry tracking failed:", error);
    }
  }

  const context = await getMemberWaveContext(userId);

  const currentPathway =
    (context.membership.pathway === "discover" ||
    context.membership.pathway === "relate"
      ? context.membership.pathway
      : null) ?? requestedPathway;

  if (
    context.progression.phase === "PRE_WAVE" ||
    context.progression.weekNumber == null ||
    context.progression.dayNumber == null
  ) {
    const suffix = currentPathway ? `?pathway=${currentPathway}` : "";
    redirect(`/prewave${suffix}`);
  }

  // 🔒 Journey payment gate:
  // If the wave has started but this member has not been activated/unlocked yet,
  // do NOT allow direct entry into Journey.
  if (!context.membership.activatedAt) {
    const suffix = currentPathway ? `?pathway=${currentPathway}` : "";
    redirect(`/journey/unlock${suffix}`);
  }

  if (context.progression.phase === "COMPLETED") {
    redirect("/pool/unlock");
  }

  const weekNumber = context.progression.weekNumber!;
  const dayNumber = context.progression.dayNumber!;
  const phase = context.progression.phase;

  const day = await getCurrentDayContent({
    phase,
    weekNumber,
    dayNumber,
    userId,
  });

  const progressCounter = await getProgressCounterForUser(userId);
  const discoverReadinessSignal = await getDiscoverReadinessSignal(userId);

  const threadPrompts = day.prompts.filter((p) => p.type === "thread_prompt");
  const mirrorExercise =
    day.prompts.find((p) => p.type === "mirror_exercise") ?? null;

  const threadMap = new Map<string, PromptThreadDTO | null>();
  await Promise.all(
    threadPrompts
      .filter((p) => p.isCompleted)
      .map(async (p) => {
        const thread = await getPromptThread(p.id, userId);
        threadMap.set(p.id, thread);
      })
  );

  const countedLiteMirrorEligible = await isLiteMirrorEligible({
    userId,
    cohortId: context.wave.id,
    activatedAt: context.membership.activatedAt,
  });

  const immediateLiteMirrorEligible = dayNumber >= 2;

  const liteMirrorUnlocked = await isMirrorTierUnlocked({
    userId,
    weekNumber,
    dayNumber,
    tier: "lite",
  });

  const liteMirrorEligible =
    liteMirrorUnlocked ||
    countedLiteMirrorEligible ||
    immediateLiteMirrorEligible;

  const fullMirrorEligible = isFullMirrorEligible(weekNumber);

  const fullMirrorUnlocked = fullMirrorEligible
    ? await isMirrorTierUnlocked({
        userId,
        weekNumber,
        dayNumber,
        tier: "full",
      })
    : false;

  const canViewMirror = fullMirrorEligible
    ? fullMirrorUnlocked
    : liteMirrorEligible
      ? liteMirrorUnlocked
      : false;

  const mirrorHistory = canViewMirror ? await getMirrorHistory(userId) : [];

  const latestMirrorSynthesis =
    mirrorHistory.find(
      (m) => m.weekNumber === weekNumber && m.dayNumber === dayNumber
    ) ?? null;

  const backgroundImage = getJourneyBackground(phase, weekNumber);
  const overlayStyle = getJourneyOverlayStyle(phase, weekNumber);

  const roomMeaning =
    weekNumber === 1
      ? "A place to arrive, and to be met without pressure."
      : day.weekTheme;

  return (
    <>
      {requestedPathway && (
        <Script id="clean-url" strategy="afterInteractive">
          {`
            const url = new URL(window.location.href);
            url.searchParams.delete("pathway");
            window.history.replaceState({}, "", url.pathname);
          `}
        </Script>
      )}

      <main className="relative h-screen overflow-hidden bg-black text-white">
        <style>{`
          .journey-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .journey-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={overlayStyle}
        />

        <div className="journey-scroll relative z-10 h-full overflow-y-auto">
          <div className="mx-auto max-w-2xl space-y-10 px-6 py-12">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-white">
                {day.weekTitle}
              </h1>

              <p className="text-sm text-zinc-400">
  {context.wave.name === "Wave 2026-04-01"
    ? "Your Wave"
    : context.wave.name}
</p>

              <p className="max-w-xl text-sm leading-7 text-zinc-400">
                {roomMeaning}
              </p>
            </div>

            <div className="space-y-4">
              {threadPrompts.map((prompt, i) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  index={i + 1}
                  thread={threadMap.get(prompt.id) ?? null}
                  progressRatio={progressCounter.ratio}
                  discoverReadinessSignal={discoverReadinessSignal}
                  currentPathway={currentPathway}
                />
              ))}
            </div>

            {mirrorExercise && (
              <div className="border-t border-zinc-800 pt-8">
                <MirrorCard
                  prompt={mirrorExercise}
                  progressRatio={progressCounter.ratio}
                />
              </div>
            )}

            <div className="border-t border-zinc-800 pt-8">
              <MirrorOutput
                weekNumber={weekNumber}
                dayNumber={dayNumber}
                liteMirrorEligible={liteMirrorEligible}
                fullMirrorEligible={fullMirrorEligible}
                liteMirrorUnlocked={liteMirrorUnlocked}
                fullMirrorUnlocked={fullMirrorUnlocked}
                mirror={latestMirrorSynthesis}
                mirrorExerciseCompleted={Boolean(
                  mirrorExercise && mirrorExercise.isCompleted
                )}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}