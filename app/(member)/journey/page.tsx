import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentDayContent } from "@/app/(member)/journey/journey.service";
import PromptCard from "./prompt-card";
import MirrorCard from "./mirror-card";

export const dynamic = "force-dynamic";

type JourneyPageProps = {
  searchParams?: {
    payment?: string;
  };
};

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

export default async function JourneyPage({
  searchParams,
}: JourneyPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const paymentSuccess = searchParams?.payment === "success";

  let content: Awaited<ReturnType<typeof getCurrentDayContent>> | null = null;
  let contentLoadFailed = false;

  try {
    content = await getCurrentDayContent(userId);
  } catch (error) {
    contentLoadFailed = true;
    console.error("Journey content failed to load:", error);
  }

  const backgrounds = getJourneyBackgrounds(content?.weekNumber);

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      {/* Mobile portrait background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${backgrounds.mobile})` }}
      />

      {/* Desktop landscape background */}
      <div
        className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${backgrounds.desktop})` }}
      />

      {/* Shared dark overlay */}
      <div className="fixed inset-0 z-10 bg-black/55" />

      {/* Content */}
      <div className="relative z-20 min-h-screen px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <header className="space-y-4">
            <h1 className="text-3xl">
              {content?.weekTitle || "Journey Active"}
            </h1>

            {paymentSuccess && (
              <p className="text-green-400">Payment success confirmed</p>
            )}

            {content ? (
              <>
                <p className="text-zinc-300">
                  Week {content.weekNumber} · Day {content.dayNumber}
                </p>

                <p className="text-zinc-300">{content.weekTheme}</p>
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
          ) : null}

          <p className="mt-8 text-sm text-zinc-500">User ID: {userId}</p>
        </div>
      </div>
    </main>
  );
}