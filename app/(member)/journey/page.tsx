import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentDayContent } from "@/app/(member)/journey/journey.service";
import PromptCard from "./prompt-card";
import MirrorCard from "./mirror-card";
import { getMemberWaveContext } from "@/src/lib/wave/wave.service";
import { getWaveNameVoteCounts } from "@/src/lib/wave/wave-name-vote.service";
import MemberNav from "../member-nav";
import { isMirrorTierUnlocked } from "@/app/(member)/mirror/mirror-unlock.service";

export const dynamic = "force-dynamic";

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

export default async function JourneyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let content: Awaited<ReturnType<typeof getCurrentDayContent>> | null = null;
  let contentLoadFailed = false;

  try {
    content = await getCurrentDayContent(userId);
  } catch (error) {
    contentLoadFailed = true;
    console.error("Journey content failed to load:", error);
  }

  let displayWaveName = "Your Wave";

  try {
    const waveContext = await getMemberWaveContext(userId);

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

  const backgrounds = getJourneyBackgrounds(content?.weekNumber);

  const mirrorUnlockHref =
    content
      ? `/mirror/unlock?weekNumber=${content.weekNumber}&dayNumber=${content.dayNumber}&tier=full`
      : "/mirror/unlock?tier=full";

  let fullMirrorUnlocked = false;

  if (content) {
    try {
      fullMirrorUnlocked = await isMirrorTierUnlocked({
        userId,
        weekNumber: content.weekNumber,
        dayNumber: content.dayNumber,
        tier: "full",
      });
    } catch (error) {
      console.error("Mirror unlock check failed:", error);
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
            <header className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                Wave
              </p>

              <h1 className="text-3xl">{displayWaveName || "Your Wave"}</h1>

              {content ? (
                <>
                  <p className="text-zinc-200">{content.weekTitle}</p>
                  <p className="text-zinc-400">{content.weekTheme}</p>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-zinc-300">Your Journey page is stable.</p>

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

                {!fullMirrorUnlocked ? (
                  <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <p className="text-sm text-zinc-400">Mirror</p>

                    <p className="mt-3 text-lg text-white">
                      A premium reflection layer woven daily from your Journey.
                    </p>

                    <p className="mt-2 text-sm text-zinc-300">
                      Receive deeper pattern-based reflections across what you
                      share, so remember — the more you share the more you
                      receive. Including themes, contradictions, emotional
                      loops, and emerging growth over time.
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                      Your current Journey includes one deeper Mirror reflection
                      at the end of your 10 week. Mirror access unlocks this
                      reflective layer daily, throughout your full Journey.
                    </p>

                    <a
                      href={mirrorUnlockHref}
                      className="mt-5 inline-flex rounded-full border border-white/20 px-5 py-2 text-sm text-white transition hover:bg-white/10"
                    >
                      Unlock Mirror — R720
                    </a>
                  </div>
                ) : (
                  <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <p className="text-sm text-zinc-400">Mirror</p>

                    <p className="mt-3 text-lg text-white">
                      Mirror is unlocked across your Journey.
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                      Your deeper reflective layer is active.
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}