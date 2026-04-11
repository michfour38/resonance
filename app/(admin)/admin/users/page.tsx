'use client';

// app/(admin)/users/page.tsx
// List all users. Toggle between all users and unassigned-only.

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';

export default function UsersPage() {
  const searchParams  = useSearchParams();
  const defaultFilter = searchParams.get('filter') === 'unassigned';
  const [unassigned, setUnassigned] = useState(defaultFilter);

  const { data: users } = trpc.admin.listUsers.useQuery({ unassigned });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Users</h1>
        <div className="flex rounded-lg border border-stone-200 p-1 bg-white">
          {[
            { label: 'All',        value: false },
            { label: 'Unassigned', value: true  },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setUnassigned(opt.value)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                unassigned === opt.value
                  ? 'bg-[#2D4A3E] text-white'
                  : 'text-stone-600 hover:text-stone-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {!users && <p className="text-sm text-stone-400">Loading…</p>}
        {users?.length === 0 && (
          <p className="text-sm text-stone-500">
            {unassigned ? 'No unassigned users.' : 'No users yet.'}
          </p>
        )}
        {users?.map((u) => {
          const membership = (u as any).cohortMemberships?.[0];
          return (
            <div
              key={u.id}
              className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-stone-800">{u.displayName}</p>
                <p className="text-xs text-stone-500 mt-0.5 capitalize">
                  {u.pathway} · {u.journeyStatus}
                </p>
              </div>
              <div className="text-right">
                {membership ? (
                  <div>
                    <p className="text-xs text-stone-600 font-medium">{membership.cohort.name}</p>
                    <p className="text-xs text-stone-400 capitalize">{membership.cohort.status}</p>
                  </div>
                ) : (
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
                    Unassigned
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
