import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMemberCircles } from "../circles/circles.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const circles = await getMemberCircles(userId);

  if (circles.length === 0) redirect("/onboarding");

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">Your circles</h1>

        <div className="space-y-4">
          {circles.map((circle) => (
            <Link
              key={circle.id}
              href={`/circles/${circle.id}`}
              className="block border rounded-2xl p-4 space-y-1 hover:bg-zinc-50 transition-colors"
            >
              <div className="text-base font-medium">{circle.name}</div>
              <div className="text-xs text-zinc-500">
                {circle.postCount} {circle.postCount === 1 ? "post" : "posts"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}