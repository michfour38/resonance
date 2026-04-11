// app/(admin)/layout.tsx
// Admin shell layout — Clerk edition.
// Server Component — verifies isAdmin from database on every request.

import { redirect, notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function AdminLayout({
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
    select: { isAdmin: true },
  });

  if (!profile?.isAdmin) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <header className="bg-[#2D4A3E] text-white">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <span className="font-semibold text-sm tracking-wide">
            Resonance — Admin
          </span>
          <nav className="flex items-center gap-4 text-sm text-stone-300">
            <a href="/oremea/enter" className="hover:text-white">Home</a>
            <a href="/admin/cohorts" className="hover:text-white">Cohorts</a>
            <a href="/admin/users" className="hover:text-white">Users</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}