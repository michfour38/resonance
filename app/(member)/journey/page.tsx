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
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl">
        {content?.weekTitle || "Journey Active"}
      </h1>

      {paymentSuccess && (
        <p className="mt-4 text-green-400">Payment success confirmed</p>
      )}

      {content ? (
        <>
          <p className="mt-4 text-zinc-300">
            Week {content.weekNumber} · Day {content.dayNumber}
          </p>

          <p className="mt-4 text-zinc-300">{content.weekTheme}</p>

          {content.prompts?.[0]?.content ? (
            <div className="mt-6 rounded-xl border border-zinc-700 p-4">
              <p className="text-sm text-zinc-400">Today’s first prompt</p>
              <p className="mt-2 text-white">{content.prompts[0].content}</p>
            </div>
          ) : (
            <p className="mt-6 text-zinc-400">
              No prompt is available for today yet.
            </p>
          )}
        </>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-zinc-300">
            Your Journey page is stable.
          </p>

          <p className="text-zinc-400">
            {contentLoadFailed
              ? "Journey content could not be loaded yet."
              : "Journey content is not available yet."}
          </p>
        </div>
      )}

      <p className="mt-8 text-sm text-zinc-500">User ID: {userId}</p>
    </main>
  );
}