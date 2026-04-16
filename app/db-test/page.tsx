import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DbTestPage() {
  const weeks = await prisma.journey_weeks.count();
  const publishedWeeks = await prisma.journey_weeks.count({
    where: { is_published: true },
  });

  const days = await prisma.journey_days.count();

  const prompts = await prisma.day_prompts.count();
  const publishedPrompts = await prisma.day_prompts.count({
    where: { is_published: true },
  });

  const firstWeek = await prisma.journey_weeks.findFirst({
    orderBy: { week_number: "asc" },
    select: {
      id: true,
      week_number: true,
      title: true,
      is_published: true,
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl">DB Test</h1>

      <div className="mt-6 space-y-2 text-sm">
        <p>weeks: {weeks}</p>
        <p>publishedWeeks: {publishedWeeks}</p>
        <p>days: {days}</p>
        <p>prompts: {prompts}</p>
        <p>publishedPrompts: {publishedPrompts}</p>
      </div>

      <div className="mt-6 text-sm text-zinc-300">
        <p>firstWeekId: {firstWeek?.id ?? "none"}</p>
        <p>firstWeekNumber: {firstWeek?.week_number ?? "none"}</p>
        <p>firstWeekTitle: {firstWeek?.title ?? "none"}</p>
        <p>firstWeekPublished: {String(firstWeek?.is_published ?? false)}</p>
      </div>
    </main>
  );
}