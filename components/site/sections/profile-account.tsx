"use client";

import { useUser } from "@clerk/nextjs";

export function ProfileAccount() {
  const { user } = useUser();

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
            Account
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.18em] text-zinc-500">
                Name
              </p>

              <p className="text-lg text-zinc-200">
                {user?.fullName || "Oremea Member"}
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.18em] text-zinc-500">
                Email
              </p>

              <p className="text-lg text-zinc-200">
                {user?.primaryEmailAddress?.emailAddress || "—"}
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.18em] text-zinc-500">
                Member Since
              </p>

              <p className="text-lg text-zinc-200">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.18em] text-zinc-500">
                Participation Style
              </p>

              <p className="text-lg text-zinc-200">
                Self-led reflective participation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}