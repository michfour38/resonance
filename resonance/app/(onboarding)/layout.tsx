// app/(onboarding)/layout.tsx
//
// Layout for the onboarding flow.
// Auth-only guard — does NOT check profile completion.
//
// Why this is a separate route group from (app):
//   (app)/layout.tsx redirects incomplete users to /onboarding/welcome.
//   If that route lived inside (app), the layout would run again on the
//   redirect and loop infinitely. This separate group breaks the loop:
//   (app)/layout.tsx only runs for routes under (app).
//
// Inverse guard: if the user already completed onboarding, send them
// to /dashboard rather than letting them re-run onboarding.

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // If onboarding is already done, don't let the user re-enter the flow
  const profile = await prisma.profile.findUnique({
    where:  { id: userId },
    select: { onboardingDone: true },
  });

  if (profile?.onboardingDone) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <span className="text-2xl font-semibold tracking-tight text-[#2D4A3E]">
            Resonance
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
