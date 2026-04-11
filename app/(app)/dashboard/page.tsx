import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const PATHWAY_LABEL: Record<string, string> = {
  discover: "Discover",
  relate: "Relate",
  harmonize: "Harmonize",
};

const PATHWAY_DESCRIPTION: Record<string, string> = {
  discover: "Exploring who you are through reflection and inquiry.",
  relate: "Deepening how you connect and communicate with others.",
  harmonize: "Integrating different parts of yourself and your life.",
};

function formatStartDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysUntil(date: Date): number {
  const now = new Date();
  const ms = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

type DashboardProfile = {
  display_name: string | null;
  journey_status: string | null;
  pathway: string | null;
};

type DashboardMembership = {
  cohort: {
    name: string;
    start_at: Date;
    status: string;
  } | null;
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [profile, membership] = await Promise.all([
    prisma.profiles.findUnique({
      where: { id: userId },
      select: {
        display_name: true,
        journey_status: true,
        pathway: true,
      },
    }),
    prisma.cohort_members.findFirst({
      where: {
        user_id: userId,
        status: { in: ["enrolled", "active"] },
      },
      include: {
        cohorts: {
          select: {
            name: true,
            start_at: true,
            status: true,
          },
        },
      },
    }),
  ]);

  const typedProfile = profile as DashboardProfile | null;
  const cohort = (membership as any)?.cohorts ?? null;
  const startDate = cohort ? new Date(cohort.start_at) : null;
  const days = startDate ? daysUntil(startDate) : null;
  const pathway = typedProfile?.pathway ?? null;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#2D4A3E]">
          Welcome, {typedProfile?.display_name ?? "there"}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Your journey is being prepared.
        </p>
      </div>

      <div className="space-y-3">
        {pathway && (
          <div className="rounded-xl border border-stone-200 bg-white px-5 py-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-stone-400">
              Pathway
            </p>
            <p className="text-sm font-medium text-stone-800">
              {PATHWAY_LABEL[pathway] ?? pathway}
            </p>
            <p className="mt-0.5 text-xs text-stone-500">
              {PATHWAY_DESCRIPTION[pathway] ?? ""}
            </p>
          </div>
        )}

        {cohort && startDate ? (
          <div className="rounded-xl border border-stone-200 bg-white px-5 py-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-stone-400">
              Cohort
            </p>
            <p className="text-sm font-medium text-stone-800">{cohort.name}</p>
            <p className="mt-0.5 text-xs text-stone-500">
              Begins {formatStartDate(startDate)}
              {days !== null && days > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-[#D1E7E0] px-2 py-0.5 font-medium text-[#2D4A3E]">
                  {days} {days === 1 ? "day" : "days"} away
                </span>
              )}
              {days === 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-[#D1E7E0] px-2 py-0.5 font-medium text-[#2D4A3E]">
                  Starting today
                </span>
              )}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-stone-200 bg-white px-5 py-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-stone-400">
              Cohort
            </p>
            <p className="text-sm text-stone-500">
              You haven't been assigned to a cohort yet. You'll receive an email
              when your cohort is ready.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-stone-200 bg-white px-5 py-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-stone-400">
            Journey status
          </p>
          <p className="text-sm font-medium capitalize text-stone-800">
            {typedProfile?.journey_status ?? "waiting"}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">
            {cohort
              ? "Your 10-week journey begins automatically when your cohort starts."
              : "Your journey will begin once you've been placed in a cohort."}
          </p>
        </div>
      </div>
    </div>
  );
}