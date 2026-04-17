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

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <header className="space-y-4">
          <h1 className="text-3xl">{content?.weekTitle || "Journey Active"}</h1>

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
    </main>
  );
}