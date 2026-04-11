'use client';

// app/(admin)/cohorts/[id]/page.tsx
// Cohort detail: view members, create circle, assign user to cohort,
// assign user to circle within this cohort.

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';

export default function CohortDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: cohort, refetch } = trpc.admin.getCohort.useQuery({ cohortId: id });
  const { data: unassignedUsers }  = trpc.admin.listUsers.useQuery({ unassigned: true });

  // ── Assign user to cohort ──────────────────────────────────────────────────
  const [assignUserId, setAssignUserId] = useState('');
  const [assignError, setAssignError]   = useState('');

  const assignToCohort = trpc.admin.assignUserToCohort.useMutation({
    onSuccess: () => { setAssignUserId(''); refetch(); },
    onError:   (e) => setAssignError(e.message),
  });

  // ── Create circle ──────────────────────────────────────────────────────────
  const [circleName, setCircleName]   = useState('');
  const [circleError, setCircleError] = useState('');

  const createCircle = trpc.admin.createCircle.useMutation({
    onSuccess: () => { setCircleName(''); refetch(); },
    onError:   (e) => setCircleError(e.message),
  });

  // ── Assign user to circle ──────────────────────────────────────────────────
  const [circleAssign, setCircleAssign] = useState<{ circleId: string; userId: string }>({
    circleId: '', userId: '',
  });
  const [circleAssignError, setCircleAssignError] = useState('');

  const assignToCircle = trpc.admin.assignUserToCircle.useMutation({
    onSuccess: () => { setCircleAssign({ circleId: '', userId: '' }); refetch(); },
    onError:   (e) => setCircleAssignError(e.message),
  });

  // ── Activate cohort ────────────────────────────────────────────────────────
  const [activateError, setActivateError] = useState('');

  const activate = trpc.admin.activateCohort.useMutation({
    onSuccess: () => refetch(),
    onError:   (e) => setActivateError(e.message),
  });

  if (!cohort) return <p className="text-sm text-stone-400">Loading…</p>;

  const members       = cohort.members;
  const circles       = cohort.circles;
  const memberUserIds = new Set(members.map((m) => m.userId));

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-stone-400 mb-1"><a href="/admin/cohorts" className="hover:underline">Cohorts</a> /</p>
          <h1 className="text-xl font-semibold text-stone-800">{cohort.name}</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Starts {new Date(cohort.startAt).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
            {' · '}
            <span className="capitalize">{cohort.status}</span>
          </p>
        </div>
        {cohort.status !== 'active' && cohort.status !== 'completed' && (
          <div>
            <button
              onClick={() => { setActivateError(''); activate.mutate({ cohortId: id }); }}
              disabled={activate.isPending || members.length === 0}
              className="bg-[#2D4A3E] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4A7C6F] disabled:opacity-40 transition-colors"
            >
              {activate.isPending ? 'Activating…' : 'Activate cohort'}
            </button>
            {activateError && <p className="text-xs text-red-600 mt-1">{activateError}</p>}
          </div>
        )}
      </div>

      {/* Assign user to cohort */}
      <section className="bg-white border border-stone-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-stone-700 mb-3">Assign user to cohort</h2>
        <div className="flex gap-2">
          <select
            value={assignUserId}
            onChange={(e) => { setAssignUserId(e.target.value); setAssignError(''); }}
            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
          >
            <option value="">Select unassigned user…</option>
            {unassignedUsers?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName} — {u.pathway}
              </option>
            ))}
          </select>
          <button
            disabled={!assignUserId || assignToCohort.isPending}
            onClick={() => {
              setAssignError('');
              assignToCohort.mutate({ userId: assignUserId, cohortId: id });
            }}
            className="bg-[#2D4A3E] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4A7C6F] disabled:opacity-40 transition-colors"
          >
            {assignToCohort.isPending ? 'Assigning…' : 'Assign'}
          </button>
        </div>
        {assignError && <p className="text-xs text-red-600 mt-2">{assignError}</p>}
        {unassignedUsers?.length === 0 && (
          <p className="text-xs text-stone-400 mt-2">No unassigned users.</p>
        )}
      </section>

      {/* Members */}
      <section>
        <h2 className="text-sm font-semibold text-stone-700 mb-3">
          Members ({members.length})
        </h2>
        {members.length === 0 ? (
          <p className="text-sm text-stone-400">No members yet.</p>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-stone-800">{m.user.displayName}</p>
                  <p className="text-xs text-stone-500 capitalize">{m.user.pathway} · {m.status}</p>
                </div>
                <span className="text-xs text-stone-400 font-mono">{m.userId.slice(0, 20)}…</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Circles */}
      <section className="bg-white border border-stone-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-stone-700 mb-3">
          Circles ({circles.length})
        </h2>

        {/* Create circle */}
        <div className="flex gap-2 mb-4">
          <input
            value={circleName}
            onChange={(e) => { setCircleName(e.target.value); setCircleError(''); }}
            placeholder="Circle name…"
            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
          />
          <button
            disabled={!circleName.trim() || createCircle.isPending}
            onClick={() => createCircle.mutate({ cohortId: id, name: circleName.trim() })}
            className="border border-stone-300 rounded-lg px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-colors"
          >
            {createCircle.isPending ? 'Creating…' : '+ Circle'}
          </button>
        </div>
        {circleError && <p className="text-xs text-red-600 mb-3">{circleError}</p>}

        {circles.length === 0 ? (
          <p className="text-sm text-stone-400">No circles yet.</p>
        ) : (
          <div className="space-y-2">
            {circles.map((c) => (
              <div key={c.id} className="flex items-center justify-between border border-stone-100 rounded-lg px-3 py-2">
                <p className="text-sm text-stone-700">{c.name}</p>
                <p className="text-xs text-stone-400">{c._count.members} members</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Assign user to circle */}
      {circles.length > 0 && members.length > 0 && (
        <section className="bg-white border border-stone-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-3">Assign member to circle</h2>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={circleAssign.userId}
              onChange={(e) => setCircleAssign((v) => ({ ...v, userId: e.target.value }))}
              className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
            >
              <option value="">Select member…</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>{m.user.displayName}</option>
              ))}
            </select>
            <select
              value={circleAssign.circleId}
              onChange={(e) => setCircleAssign((v) => ({ ...v, circleId: e.target.value }))}
              className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
            >
              <option value="">Select circle…</option>
              {circles.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button
            disabled={!circleAssign.userId || !circleAssign.circleId || assignToCircle.isPending}
            onClick={() => {
              setCircleAssignError('');
              assignToCircle.mutate({
                userId:   circleAssign.userId,
                circleId: circleAssign.circleId,
              });
            }}
            className="bg-[#2D4A3E] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4A7C6F] disabled:opacity-40 transition-colors"
          >
            {assignToCircle.isPending ? 'Assigning…' : 'Assign to circle'}
          </button>
          {circleAssignError && <p className="text-xs text-red-600 mt-2">{circleAssignError}</p>}
        </section>
      )}

    </div>
  );
}
