'use client';

// app/(admin)/cohorts/page.tsx
// List all cohorts + create new cohort form.

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

export default function CohortsPage() {
  const { data: cohorts, refetch } = trpc.admin.listCohorts.useQuery();

  const [showForm, setShowForm]   = useState(false);
  const [name, setName]           = useState('');
  const [startAt, setStartAt]     = useState('');
  const [pathway, setPathway]     = useState('');
  const [error, setError]         = useState('');

  const create = trpc.admin.createCohort.useMutation({
    onSuccess: () => {
      setShowForm(false);
      setName('');
      setStartAt('');
      setPathway('');
      refetch();
    },
    onError: (e) => setError(e.message),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !startAt) return;
    create.mutate({
      name:    name.trim(),
      startAt: new Date(startAt),
      pathway: pathway as any || undefined,
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Cohorts</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#2D4A3E] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4A7C6F] transition-colors"
        >
          {showForm ? 'Cancel' : '+ New cohort'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-stone-200 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-stone-700">New cohort</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-500 mb-1">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Spring 2025"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Start date</label>
              <input
                required
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1">Pathway (optional)</label>
            <select
              value={pathway}
              onChange={(e) => setPathway(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
            >
              <option value="">Mixed / any pathway</option>
              <option value="discover">Discover</option>
              <option value="relate">Relate</option>
              <option value="harmonize">Harmonize</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={create.isPending}
            className="bg-[#2D4A3E] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4A7C6F] disabled:opacity-50 transition-colors"
          >
            {create.isPending ? 'Creating…' : 'Create cohort'}
          </button>
        </form>
      )}

      {/* Cohort list */}
      <div className="space-y-2">
        {!cohorts && (
          <p className="text-sm text-stone-400">Loading…</p>
        )}
        {cohorts?.length === 0 && (
          <p className="text-sm text-stone-500">No cohorts yet. Create one above.</p>
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
                Starts {new Date(c.startAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
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
