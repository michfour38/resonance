"use client";

// app/(admin)/cohorts/[id]/page.tsx
// Cohort detail: view members, create circle, assign user to cohort,
// assign user to circle within this cohort.

import { useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

type CohortMember = {
  id: string;
  userId: string;
  status: string;
  user: {
    displayName: string;
    pathway: string | null;
  };
};

type CohortCircle = {
  id: string;
  name: string;
  _count: {
    members: number;
  };
};

type UnassignedUser = {
  id: string;
  displayName: string;
  pathway: string | null;
};

export default function CohortDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const { data: cohort, refetch } = trpc.admin.getCohort.useQuery({ cohortId: id });
  const { data: unassignedUsers } = trpc.admin.listUsers.useQuery({ unassigned: true });

  const [assignUserId, setAssignUserId] = useState("");
  const [assignError, setAssignError] = useState("");

  const assignToCohort = trpc.admin.assignUserToCohort.useMutation({
    onSuccess: () => {
      setAssignUserId("");
      refetch();
    },
    onError: (e) => setAssignError(e.message),
  });

  const [circleName, setCircleName] = useState("");
  const [circleError, setCircleError] = useState("");

  const createCircle = trpc.admin.createCircle.useMutation({
    onSuccess: () => {
      setCircleName("");
      refetch();
    },
    onError: (e) => setCircleError(e.message),
  });

  const [circleAssign, setCircleAssign] = useState<{ circleId: string; userId: string }>({
    circleId: "",
    userId: "",
  });
  const [circleAssignError, setCircleAssignError] = useState("");

  const assignToCircle = trpc.admin.assignUserToCircle.useMutation({
    onSuccess: () => {
      setCircleAssign({ circleId: "", userId: "" });
      refetch();
    },
    onError: (e) => setCircleAssignError(e.message),
  });

  const [activateError, setActivateError] = useState("");

  const activate = trpc.admin.activateCohort.useMutation({
    onSuccess: () => refetch(),
    onError: (e) => setActivateError(e.message),
  });

  if (!cohort) return <p className="text-sm text-stone-400">Loading…</p>;

  const members = (cohort.members ?? []) as CohortMember[];
  const circles = (cohort.circles ?? []) as CohortCircle[];
  const availableUsers = (unassignedUsers ?? []) as UnassignedUser[];

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs text-stone-400">
            <a href="/admin/cohorts" className="hover:underline">
              Cohorts
            </a>{" "}
            /
          </p>
          <h1 className="text-xl font-semibold text-stone-800">{cohort.name}</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Starts{" "}
            {new Date(cohort.startAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            <span className="capitalize">{cohort.status}</span>
          </p>
        </div>

        {cohort.status !== "active" && cohort.status !== "completed" && (
          <div>
            <button
              onClick={() => {
                setActivateError("");
                activate.mutate({ cohortId: id });
              }}
              disabled={activate.isPending || members.length === 0}
              className="rounded-lg bg-[#2D4A3E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4A7C6F] disabled:opacity-40"
            >
              {activate.isPending ? "Activating…" : "Activate cohort"}
            </button>
            {activateError && <p className="mt-1 text-xs text-red-600">{activateError}</p>}
          </div>
        )}
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-stone-700">Assign user to cohort</h2>
        <div className="flex gap-2">
          <select
            value={assignUserId}
            onChange={(e) => {
              setAssignUserId(e.target.value);
              setAssignError("");
            }}
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
          >
            <option value="">Select unassigned user…</option>
            {availableUsers.map((u: UnassignedUser) => (
              <option key={u.id} value={u.id}>
                {u.displayName} — {u.pathway}
              </option>
            ))}
          </select>

          <button
            disabled={!assignUserId || assignToCohort.isPending}
            onClick={() => {
              setAssignError("");
              assignToCohort.mutate({ userId: assignUserId, cohortId: id });
            }}
            className="rounded-lg bg-[#2D4A3E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4A7C6F] disabled:opacity-40"
          >
            {assignToCohort.isPending ? "Assigning…" : "Assign"}
          </button>
        </div>

        {assignError && <p className="mt-2 text-xs text-red-600">{assignError}</p>}

        {availableUsers.length === 0 && (
          <p className="mt-2 text-xs text-stone-400">No unassigned users.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-stone-700">Members ({members.length})</h2>

        {members.length === 0 ? (
          <p className="text-sm text-stone-400">No members yet.</p>
        ) : (
          <div className="space-y-2">
            {members.map((m: CohortMember) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-stone-800">{m.user.displayName}</p>
                  <p className="text-xs capitalize text-stone-500">
                    {m.user.pathway} · {m.status}
                  </p>
                </div>
                <span className="font-mono text-xs text-stone-400">
                  {m.userId.slice(0, 20)}…
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-stone-700">
          Circles ({circles.length})
        </h2>

        <div className="mb-4 flex gap-2">
          <input
            value={circleName}
            onChange={(e) => {
              setCircleName(e.target.value);
              setCircleError("");
            }}
            placeholder="Circle name…"
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
          />
          <button
            disabled={!circleName.trim() || createCircle.isPending}
            onClick={() => createCircle.mutate({ cohortId: id, name: circleName.trim() })}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-40"
          >
            {createCircle.isPending ? "Creating…" : "+ Circle"}
          </button>
        </div>

        {circleError && <p className="mb-3 text-xs text-red-600">{circleError}</p>}

        {circles.length === 0 ? (
          <p className="text-sm text-stone-400">No circles yet.</p>
        ) : (
          <div className="space-y-2">
            {circles.map((c: CohortCircle) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2"
              >
                <p className="text-sm text-stone-700">{c.name}</p>
                <p className="text-xs text-stone-400">{c._count.members} members</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {circles.length > 0 && members.length > 0 && (
        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-stone-700">Assign member to circle</h2>

          <div className="mb-2 grid grid-cols-2 gap-2">
            <select
              value={circleAssign.userId}
              onChange={(e) =>
                setCircleAssign((v) => ({ ...v, userId: e.target.value }))
              }
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
            >
              <option value="">Select member…</option>
              {members.map((m: CohortMember) => (
                <option key={m.userId} value={m.userId}>
                  {m.user.displayName}
                </option>
              ))}
            </select>

            <select
              value={circleAssign.circleId}
              onChange={(e) =>
                setCircleAssign((v) => ({ ...v, circleId: e.target.value }))
              }
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]"
            >
              <option value="">Select circle…</option>
              {circles.map((c: CohortCircle) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={!circleAssign.userId || !circleAssign.circleId || assignToCircle.isPending}
            onClick={() => {
              setCircleAssignError("");
              assignToCircle.mutate({
                userId: circleAssign.userId,
                circleId: circleAssign.circleId,
              });
            }}
            className="rounded-lg bg-[#2D4A3E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4A7C6F] disabled:opacity-40"
          >
            {assignToCircle.isPending ? "Assigning…" : "Assign to circle"}
          </button>

          {circleAssignError && (
            <p className="mt-2 text-xs text-red-600">{circleAssignError}</p>
          )}
        </section>
      )}
    </div>
  );
}