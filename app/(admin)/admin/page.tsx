import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminHomePage() {
  const [userCount, cohortCount, unassignedCount] = await Promise.all([
    prisma.profiles.count(),
    prisma.cohorts.count(),
    prisma.profiles.count({
      where: {
        cohort_members: {
          none: {
            status: { in: ["enrolled", "active"] },
          },
        },
      },
    }),
  ]);

  const stats = [
    { label: "Total users", value: userCount, href: "/admin/users" },
    {
      label: "Unassigned users",
      value: unassignedCount,
      href: "/admin/users?filter=unassigned",
    },
    { label: "Cohorts", value: cohortCount, href: "/admin/cohorts" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-stone-800">Admin</h1>

      <div className="mb-8 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-stone-200 bg-white px-5 py-4 transition-colors hover:border-stone-300"
          >
            <p className="text-2xl font-semibold text-[#2D4A3E]">{s.value}</p>
            <p className="mt-0.5 text-sm text-stone-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/cohorts"
          className="rounded-lg bg-[#2D4A3E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4A7C6F]"
        >
          Manage cohorts
        </Link>
        <Link
          href="/admin/users"
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-50"
        >
          View users
        </Link>
      </div>
    </div>
  );
}