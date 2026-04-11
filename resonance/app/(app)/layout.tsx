// app/(app)/layout.tsx
// Main application shell layout — Clerk edition.
// Server Component — runs on every request for routes inside (app).
//
// Responsibilities:
//   1. Belt-and-suspenders auth check after middleware.
//   2. Verify onboarding is complete — redirect to /onboarding/welcome if not.
//   3. Render the nav shell around children.
//
// Redirect loop prevention:
//   /onboarding/welcome is NOT inside (app) — it lives in the (onboarding)
//   route group with its own layout. This layout therefore never runs on
//   the /onboarding/welcome route, so the redirect cannot loop.
//
// What this layout does NOT check:
//   - journey_status (tRPC activeProc handles this per-procedure)
//   - is_admin (handled in the (admin) layout)

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const profile = await prisma.profile.findUnique({
    where:  { id: userId },
    select: { onboardingDone: true, displayName: true },
  });

  if (!profile || !profile.onboardingDone) {
    redirect('/onboarding/welcome');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-[#2D4A3E]">Resonance</span>
          <nav className="flex items-center gap-4 text-sm text-stone-600">
            <a href="/dashboard" className="hover:text-stone-900">Journey</a>
            <a href="/circle"    className="hover:text-stone-900">Circle</a>
            <a href="/journal"   className="hover:text-stone-900">Journal</a>
            <a href="/insights"  className="hover:text-stone-900">Insights</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}
