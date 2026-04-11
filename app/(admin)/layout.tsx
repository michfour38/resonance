import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: { is_admin: true },
  });

  if (!profile?.is_admin) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <header className="bg-[#2D4A3E] text-white">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
          <span className="text-sm font-semibold tracking-wide">
            Resonance — Admin
          </span>
          <nav className="flex items-center gap-4 text-sm text-stone-300">
            <a href="/oremea/enter" className="hover:text-white">
              Home
            </a>
            <a href="/admin/cohorts" className="hover:text-white">
              Cohorts
            </a>
            <a href="/admin/users" className="hover:text-white">
              Users
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}