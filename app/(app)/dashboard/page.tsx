// app/(app)/dashboard/page.tsx
// Waiting-state dashboard — Sprint 1.
//
// Server Component. Fetches profile + cohort membership in one pass.
// Handles two states:
//   1. No cohort assigned yet   → "awaiting assignment" message
//   2. Cohort assigned, waiting → cohort name + start date + countdown label

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// ── Helpers ──────────────────────────────────────────────────────────────────

const PATHWAY_LABEL: Record<string, string> = {
  discover:  'Discover',
  relate:    'Relate',
  harmonize: 'Harmonize',
};

const PATHWAY_DESCRIPTION: Record<string, string> = {
  discover:  'Exploring who you are through reflection and inquiry.',
  relate:    'Deepening how you connect and communicate with others.',
  harmonize: 'Integrating different parts of yourself and your life.',
};

function formatStartDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

function daysUntil(date: Date): number {
  const now  = new Date();
  const ms   = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const { userId } = auth();

  const [profile, membership] = await Promise.all([
    prisma.profile.findUnique({
      where:  { id: userId! },
      select: { displayName: true, journeyStatus: true, pathway: true },
    }),
    prisma.cohortMember.findFirst({
      where:   { userId: userId!, status: { in: ['enrolled', 'active'] } },
      include: { cohort: { select: { name: true, startAt: true, status: true } } },
    }),
  ]);

  const pathway     = profile?.pathway ?? null;
  const cohort      = membership?.cohort ?? null;
  const startDate   = cohort ? new Date(cohort.startAt) : null;
  const days        = startDate ? daysUntil(startDate) : null;

  return (
    <div className="max-w-2xl">

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#2D4A3E]">
          Welcome, {profile?.displayName}
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Your journey is being prepared.
        </p>
      </div>

      {/* Status cards */}
      <div className="space-y-3">

        {/* Pathway */}
        {pathway && (
          <div className="rounded-xl border border-stone-200 bg-white px-5 py-4">
            <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1">
              Pathway
            </p>
            <p className="text-sm font-medium text-stone-800">
              {PATHWAY_LABEL[pathway]}
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              {PATHWAY_DESCRIPTION[pathway]}
            </p>
          </div>
        )}

        {/* Cohort / start date */}
        {cohort && startDate ? (
          <div className="rounded-xl border border-stone-200 bg-white px-5 py-4">
            <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1">
              Cohort
            </p>
            <p className="text-sm font-medium text-stone-800">{cohort.name}</p>
            <p className="text-xs text-stone-500 mt-0.5">
              Begins {formatStartDate(startDate)}
              {days !== null && days > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-[#D1E7E0] px-2 py-0.5 text-[#2D4A3E] font-medium">
                  {days} {days === 1 ? 'day' : 'days'} away
                </span>
              )}
              {days === 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-[#D1E7E0] px-2 py-0.5 text-[#2D4A3E] font-medium">
                  Starting today
                </span>
              )}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-stone-200 bg-white px-5 py-4">
            <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1">
              Cohort
            </p>
            <p className="text-sm text-stone-500">
              You haven't been assigned to a cohort yet. You'll receive an email when your cohort is ready.
            </p>
          </div>
        )}

        {/* Journey status explainer */}
        <div className="rounded-xl border border-stone-200 bg-white px-5 py-4">
          <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1">
            Journey status
          </p>
          <p className="text-sm text-stone-800 font-medium capitalize">
            {profile?.journeyStatus ?? 'waiting'}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            {cohort
              ? 'Your 10-week journey begins automatically when your cohort starts.'
              : 'Your journey will begin once you\'ve been placed in a cohort.'}
          </p>
        </div>

      </div>
    </div>
  );
}
