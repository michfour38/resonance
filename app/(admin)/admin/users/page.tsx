"use client";

// app/(admin)/users/page.tsx
// List all users. Toggle between all users and unassigned-only.

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

type UserMembership = {
  cohort: {
    name: string;
    status: string;
  };
};

type AdminUser = {
  id: string;
  displayName: string | null;
  pathway: string | null;
  journeyStatus: string | null;
  cohortMemberships?: UserMembership[];
};

export default function UsersPage() {
  const searchParams = useSearchParams();
  const defaultFilter = searchParams.get("filter") === "unassigned";
  const [unassigned, setUnassigned] = useState(defaultFilter);

  const { data: users } = trpc.admin.listUsers.useQuery({ unassigned });

  const userList = (users ?? []) as AdminUser[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-800">Users</h1>

        <div className="flex rounded-lg border border-stone-200 bg-white p-1">
          {[
            { label: "All", value: false },
            { label: "Unassigned", value: true },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setUnassigned(opt.value)}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                unassigned === opt.value
                  ? "bg-[#2D4A3E] text-white"
                  : "text-stone-600 hover:text-stone-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {!users && <p className="text-sm text-stone-400">Loading…</p>}

        {userList.length === 0 && users && (
          <p className="text-sm text-stone-500">
            {unassigned ? "No unassigned users." : "No users yet."}
          </p>
        )}

        {userList.map((u: AdminUser) => {
          const membership = u.cohortMemberships?.[0];

          return (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {u.displayName ?? "Unnamed user"}
                </p>
                <p className="mt-0.5 text-xs capitalize text-stone-500">
                  {u.pathway ?? "unknown"} · {u.journeyStatus ?? "unknown"}
                </p>
              </div>

              <div className="text-right">
                {membership ? (
                  <div>
                    <p className="text-xs font-medium text-stone-600">
                      {membership.cohort.name}
                    </p>
                    <p className="text-xs capitalize text-stone-400">
                      {membership.cohort.status}
                    </p>
                  </div>
                ) : (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
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