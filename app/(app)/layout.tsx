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
    where: { id: userId },
    select: { onboardingDone: true },
  });

  // Prevent redirect loop
  if (!profile || !profile.onboardingDone) {
    if (typeof window === 'undefined') {
      redirect('/onboarding/welcome');
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-[#2D4A3E]">Resonance</span>
          <nav className="flex items-center gap-4 text-sm text-stone-600">
            <a href="/dashboard">Journey</a>
            <a href="/circle">Circle</a>
            <a href="/journal">Journal</a>
            <a href="/insights">Insights</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}