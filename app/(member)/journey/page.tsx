import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type JourneyPageProps = {
  searchParams?: {
    payment?: string;
  };
};

function JourneyShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src="/images/bg-prewave.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/50" />

      <div className="relative z-10">
        <div className="mx-auto max-w-4xl px-6 py-12">{children}</div>
      </div>
    </main>
  );
}

export default async function JourneyPage({
  searchParams,
}: JourneyPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const paymentSuccess = searchParams?.payment === "success";

  return (
    <JourneyShell>
      <div className="rounded-3xl border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px]">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Resonance Journey
        </p>

        <h1 className="mt-4 text-3xl font-semibold text-white">
          Welcome to your Journey
        </h1>

        {paymentSuccess && (
          <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4 text-sm text-emerald-100">
            Payment received successfully. Your Journey is now unlocked.
          </div>
        )}

        <p className="mt-4 text-base leading-7 text-zinc-300">
          Your access is active. This is your stable post-payment Journey page.
        </p>

        <p className="mt-4 text-sm leading-7 text-zinc-400">
          The next step is to reconnect the real Journey content service only
          after the underlying service-layer crash is fixed.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/prewave"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Return to Pre-Wave
          </a>

          <a
            href="/journey/unlock"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Go to Unlock Page
          </a>
        </div>
      </div>
    </JourneyShell>
  );
}