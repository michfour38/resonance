'use client';

// app/(admin)/cohorts/page.tsx
// Cohort list + Thursday-slot creation.
//
// Admins do not pick dates. Clicking "Open cohort for next Thursday"
// calls createCohort with slotLabel 'A' — the server computes the
// correct Thursday start date. The procedure is idempotent: clicking
// again returns the existing cohort rather than creating a duplicate.
//
// Phase 2 (multi-slot): a second button passing slotLabel 'B' opens
// a second cohort for the same Thursday when the first fills up.
// No UI changes needed here beyond adding that button.

import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';

const STATUS_LABEL: Record<string, string> = {
  draft:           'Draft',
  open_enrollment: 'Open enrollment',
  waiting:         'Waiting',
  active:          'Active',
  completed:       'Completed',
};

// Returns the display string for the next Thursday from the browser's clock.
// This is only used for the button label — the authoritative date is computed
// server-side in nextThursday(). The two should always agree.
function labelNextThursday(): string {
  const now = new Date();
  const day = now.getDay(); // 0 Sun … 4 Thu
  const THURSDAY = 4;
  let daysUntil = (THURSDAY - day + 7) % 7;
  if (daysUntil === 0 && now.getHours() >= 9) daysUntil = 7;
  const thu = new Date(now);
  thu.setDate(now.getDate() + daysUntil);
  return thu.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function CohortsPage() {
  const { data: cohorts, refetch } = trpc.admin.listCohorts.useQuery();
  const [error, setError]          = useState('');

  const create = trpc.admin.createCohort.useMutation({
    onSuccess: () => { setError(''); refetch(); },
    onError:   (e) => setError(e.message),
  });

  // Derive whether an open_enrollment cohort already exists for next Thursday.
  // Used to show a status hint on the button rather than hiding it.
  const nextThursdayLabel = labelNextThursday();
  const existingSlotA = cohorts?.find(
    (c) => c.status !== 'completed' && c.name.startsWith('Cohort ·') && !c.name.endsWith('· B') && !c.name.endsWith('· C')
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Cohorts</h1>
      </div>

      {/* Thursday slot panel */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6">
        <p className="text-sm font-semibold text-stone-700 mb-1">
          Next available Thursday
        </p>
        <p className="text-xs text-stone-500 mb-4">{nextThursdayLabel}</p>

        <div className="flex items-center gap-3">
          <button
            disabled={create.isPending}
            onClick={() => { setError(''); create.mutate({ slotLabel: 'A' }); }}
            className="bg-[#2D4A3E] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4A7C6F] disabled:opacity-50 transition-colors"
          >
            {create.isPending
              ? 'Opening…'
              : existingSlotA
              ? 'Cohort already open — view below'
              : 'Open cohort for this Thursday'}
          </button>

          {/* Phase 2 hook: uncomment when first cohort fills up
          <button
            disabled={!existingSlotA || create.isPending}
            onClick={() => { setError(''); create.mutate({ slotLabel: 'B' }); }}
            className="border border-stone-300 rounded-lg px-4 py-2 text-sm text-stone-700
                       hover:bg-stone-50 disabled:opacity-30 transition-colors"
          >
            Open second slot (B)
          </button>
          */}
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <p className="text-xs text-stone-400 mt-3">
          Cohort start dates are always Thursdays at 09:00 UTC. The system sets the date — you cannot pick it manually.
        </p>
      </div>

      {/* Cohort list */}
      <div className="space-y-2">
        {!cohorts && <p className="text-sm text-stone-400">Loading…</p>}
        {cohorts?.length === 0 && (
          <p className="text-sm text-stone-500">No cohorts yet.</p>
        )}
        {cohorts?.map((c) => (
          <Link
            key={c.id}
            href={`/admin/cohorts/${c.id}`}
            className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-5 py-4 hover:border-stone-300 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-stone-800">{c.name}</p>
              <p className="text-xs text-stone-500 mt-0.5">
                {new Date(c.startAt).toLocaleDateString('en-US', {
                  weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
                  timeZone: 'UTC',
                })}
                {c.pathway && ` · ${c.pathway}`}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span>{c._count.members} members</span>
              <span>{c._count.circles} circles</span>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-600">
                {STATUS_LABEL[c.status]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
