// app/(admin)/page.tsx
// Admin home — counts and quick links.

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminHomePage() {
  const [userCount, cohortCount, unassignedCount] = await Promise.all([
    prisma.profile.count(),
    prisma.cohort.count(),
    prisma.profile.count({
      where: {
        cohortMemberships: {
          none: { status: { in: ['enrolled', 'active'] } },
        },
      },
    }),
  ]);

  const stats = [
    { label: 'Total users',       value: userCount,      href: '/admin/users' },
    { label: 'Unassigned users',  value: unassignedCount, href: '/admin/users?filter=unassigned' },
    { label: 'Cohorts',           value: cohortCount,     href: '/admin/cohorts' },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Admin</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl border border-stone-200 px-5 py-4 hover:border-stone-300 transition-colors"
          >
            <p className="text-2xl font-semibold text-[#2D4A3E]">{s.value}</p>
            <p className="text-sm text-stone-500 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/cohorts"
          className="bg-[#2D4A3E] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4A7C6F] transition-colors"
        >
          Manage cohorts
        </Link>
        <Link
          href="/admin/users"
          className="border border-stone-300 rounded-lg px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
        >
          View users
        </Link>
      </div>
    </div>
  );
}
