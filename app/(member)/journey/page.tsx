import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentDayContent } from "@/src/lib/journey/getCurrentDayContent";
import PromptCard from "./prompt-card";
import MirrorCard from "./mirror-card";
import { getMemberWaveContext } from "@/src/lib/wave/wave.service";
import { getWaveNameVoteCounts } from "@/src/lib/wave/wave-name-vote.service";
import MemberNav from "../member-nav";
import { isMirrorTierUnlocked } from "@/app/(member)/mirror/mirror-unlock.service";
import MirrorOutput from "../mirror/mirror-output";
import { getMirrorHistory } from "../mirror/mirror.service";

export const dynamic = "force-dynamic";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || "";
}

async function getSignedInEmail() {
  const user = await currentUser();

  const primaryEmail =
    user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? "";

  return normalizeEmail(primaryEmail);
}

function getJourneyBackgrounds(weekNumber?: number) {
  const desktopMap: Record<number, string> = {
    1: "/images/desktop/bg-hearth.webp",
    2: "/images/desktop/bg-mirror.webp",
    3: "/images/desktop/bg-garden.webp",
    4: "/images/desktop/bg-compass.webp",
    5: "/images/desktop/bg-pulse.webp",
    6: "/images/desktop/bg-shadow.webp",
    7: "/images/desktop/bg-forge.webp",
    8: "/images/desktop/bg-vision.webp",
    9: "/images/desktop/bg-the-gathering.webp",
    10: "/images/desktop/bg-the-becoming.webp",
  };

  const mobileMap: Record<number, string> = {
    1: "/images/mobile/bg-hearth.webp",
    2: "/images/mobile/bg-mirror.webp",
    3: "/images/mobile/bg-garden.webp",
    4: "/images/mobile/bg-compass.webp",
    5: "/images/mobile/bg-pulse.webp",
    6: "/images/mobile/bg-shadow.webp",
    7: "/images/mobile/bg-forge.webp",
    8: "/images/mobile/bg-vision.webp",
    9: "/images/mobile/bg-the-gathering.webp",
    10: "/images/mobile/bg-the-becoming.webp",
  };

  const key = weekNumber ?? 1;

  return {
    desktop: desktopMap[key] ?? desktopMap[1],
    mobile: mobileMap[key] ?? mobileMap[1],
  };
}

function getWinningWaveName(
  waveNameCounts: Map<string, number>,
  fallbackWaveName: string
) {
  const sorted = Array.from(waveNameCounts.entries()).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? fallbackWaveName;
}

function isJourneyMirrorUpsellEligible(weekNumber: number, dayNumber: number) {
  return weekNumber > 1 || dayNumber >= 2;
}

// 🔒🔒🔒 TESTING DAY LOCK — REMOVE BEFORE PRODUCTION 🔒🔒🔒
function getTestingJourneyOverride() {
  const enabled = false;

  if (!enabled) return null;

  return {
    phase: "CORE" as const,
    weekNumber: 2,
    dayNumber: 1,
  };
}

export default async function JourneyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const signedInEmail = await getSignedInEmail();

  if (!signedInEmail) {
    redirect("/journey/unlock");
  }

  const journeyAccess = await prisma.entry_leads.findUnique({
    where: { email: signedInEmail },
    select: {
      journey_access_granted: true,
    },
  });

  if (!journeyAccess?.journey_access_granted) {
    redirect("/journey/unlock");
  }

  let displayWaveName = "Your Wave";
  let waveContext: Awaited<ReturnType<typeof getMemberWaveContext>> | null = null;

  try {
    waveContext = await getMemberWaveContext(userId);

    if (waveContext?.wave?.id) {
      const waveNameCounts = await getWaveNameVoteCounts(waveContext.wave.id);

      displayWaveName = getWinningWaveName(
        waveNameCounts,
        waveContext.wave.name
      );
    }
  } catch (error) {
    console.error("Wave context failed:", error);
  }

  if (!waveContext) {
    return (
      <main className="relative min-h-screen overflow-x-hidden text-white">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: "url(/images/mobile/bg-hearth.webp)" }}
        />

        <div
          className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat md:block"
          style={{ backgroundImage: "url(/images/desktop/bg-hearth.webp)" }}
        />

        <div className="fixed inset-0 z-10 bg-black/55" />

        <div className="relative z-20 min-h-screen">
          <MemberNav />

          <div className="px-6 py-6">
            <div className="mx-auto max-w-2xl">
              <header className="space-y-3">
                <h1 className="text-4xl text-white">Journey Active</h1>
                <p className="text-zinc-300">{displayWaveName || "Your Wave"}</p>
                <p className="text-zinc-400">
                  Journey content could not be loaded yet.
                </p>
              </header>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const testingOverride = getTestingJourneyOverride();

  console.log("TEST LOCK ACTIVE", testingOverride);

  const progression = testingOverride
    ? {
        ...waveContext.progression,
        phase: testingOverride.phase,
        weekNumber: testingOverride.weekNumber,
        dayNumber: testingOverride.dayNumber,
      }
    : waveContext.progression;

  if (!testingOverride && progression.phase === "PRE_WAVE") {
    redirect("/prewave");
  }

  if (progression.phase === "COMPLETED") {
    const backgrounds = getJourneyBackgrounds(10);

    return (
      <main className="relative min-h-screen overflow-x-hidden text-white">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: `url(${backgrounds.mobile})` }}
        />

        <div
          className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat md:block"
          style={{ backgroundImage: `url(${backgrounds.desktop})` }}
        />

        <div className="fixed inset-0 z-10 bg-black/55" />

        <div className="relative z-20 min-h-screen">
          <MemberNav />

          <div className="px-6 py-6">
            <div className="mx-auto max-w-2xl">
              <header className="space-y-3">
                <h1 className="text-4xl text-white">Journey Complete</h1>
                <p className="text-zinc-300">{displayWaveName || "Your Wave"}</p>
                <p className="text-zinc-400">
                  Your 10-week Resonance journey has completed.
                </p>
              </header>
            </div>
          </div>
        </div>
      </main>
    );
  }

  let content: Awaited<ReturnType<typeof getCurrentDayContent>> | null = null;
  let contentLoadFailed = false;

  const journeyPhase =
    progression.phase === "INTEGRATION" ? "INTEGRATION" : "CORE";

  try {
    content = await getCurrentDayContent({
      phase: journeyPhase,
      weekNumber: progression.weekNumber!,
      dayNumber: progression.dayNumber!,
      userId,
    });
  } catch (error) {
    contentLoadFailed = true;
    console.error("Journey content failed to load:", error);
  }

  const backgrounds = getJourneyBackgrounds(
    content?.weekNumber ?? progression.weekNumber ?? 1
  );

  let liteMirrorEligible = false;
  let fullMirrorEligible = false;
  let liteMirrorUnlocked = false;
  let fullMirrorUnlocked = false;
  let currentMirror = null;
  let mirrorExerciseCompleted = false;

  if (content) {
    try {
      mirrorExerciseCompleted = content.prompts.some(
        (prompt) => prompt.type === "mirror_exercise" && prompt.isCompleted
      );

      // Leave current mirror gating behavior unchanged for now.
      liteMirrorEligible = false;
      fullMirrorEligible = isJourneyMirrorUpsellEligible(
        content.weekNumber,
        content.dayNumber
      );

      liteMirrorUnlocked = await isMirrorTierUnlocked({
        userId,
        weekNumber: content.weekNumber,
        dayNumber: content.dayNumber,
        tier: "lite",
      });

      fullMirrorUnlocked = await isMirrorTierUnlocked({
        userId,
        weekNumber: content.weekNumber,
        dayNumber: content.dayNumber,
        tier: "full",
      });

      const mirrorHistory = await getMirrorHistory(userId);
      currentMirror =
        mirrorHistory.find(
          (entry) =>
            entry.weekNumber === content.weekNumber &&
            entry.dayNumber === content.dayNumber
        ) ?? null;
    } catch (error) {
      console.error("Mirror state failed:", error);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${backgrounds.mobile})` }}
      />

      <div
        className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${backgrounds.desktop})` }}
      />

      <div className="fixed inset-0 z-10 bg-black/55" />

      <div className="relative z-20 min-h-screen">
        <MemberNav />

        <div className="px-6 py-6">
          <div className="mx-auto max-w-2xl">
            <header className="space-y-3">
              {content ? (
                <>
                  <h1 className="text-4xl text-white">{content.weekTitle}</h1>
                  <p className="text-zinc-300">{displayWaveName || "Your Wave"}</p>
                  <p className="text-zinc-400">{content.weekTheme}</p>
                </>
              ) : (
                <div className="space-y-3">
                  <h1 className="text-4xl text-white">Journey Active</h1>
                  <p className="text-zinc-300">{displayWaveName || "Your Wave"}</p>
                  <p className="text-zinc-400">
                    {contentLoadFailed
                      ? "Journey content could not be loaded yet."
                      : "Journey content is not available yet."}
                  </p>
                </div>
              )}
            </header>

            {content ? (
              <>
                <div className="mt-10 space-y-6">
                  {content.prompts.map((prompt, index) => {
                    if (prompt.type === "mirror_exercise") {
                      return (
                        <MirrorCard
                          key={prompt.id}
                          prompt={prompt}
                          progressRatio={0.2}
                        />
                      );
                    }

                    return (
                      <PromptCard
                        key={prompt.id}
                        prompt={prompt}
                        index={index}
                      />
                    );
                  })}
                </div>

                <div className="mt-10">
                  <MirrorOutput
                    weekNumber={content.weekNumber}
                    dayNumber={content.dayNumber}
                    liteMirrorEligible={liteMirrorEligible}
                    fullMirrorEligible={fullMirrorEligible}
                    liteMirrorUnlocked={liteMirrorUnlocked}
                    fullMirrorUnlocked={fullMirrorUnlocked}
                    mirror={currentMirror}
                    mirrorExerciseCompleted={mirrorExerciseCompleted}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}