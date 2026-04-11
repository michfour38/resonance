import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getMemberWaveContext } from "../../src/lib/wave/wave.service";
import { getHoldingContent } from "../../src/lib/wave/wave.holding";
import { hasCompletedWaveDay } from "../../src/lib/wave/wave.completion";
import {
  isFullMirrorEligible,
  isLiteMirrorEligible,
} from "../../src/lib/wave/wave.mirror";
import { getCurrentDayContent } from "../../src/lib/journey/getCurrentDayContent";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const context = await getMemberWaveContext(userId);

  if (context.progression.phase === "PRE_WAVE") {
    const holding = await getHoldingContent();

    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-[2rem] border border-zinc-800 bg-black p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Pre-Wave
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            {holding.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            {holding.description}
          </p>

          <div className="mt-10 relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 shadow-[0_0_40px_rgba(255,255,255,0.03)]">
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
              <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-300 blur-3xl" />
            </div>

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Your Wave
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                {context.wave.name}
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Begins{" "}
                <span className="font-medium text-zinc-200">
                  {new Date(context.wave.startsAt).toLocaleDateString("en-ZA")}
                </span>
              </p>

              <div className="mt-4 h-px w-16 bg-gradient-to-r from-amber-400/40 to-transparent" />

              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
                This is your shared starting point. When the Wave opens, all
                active members move through the same collective rhythm together.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Holding prompts
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                Begin shaping your presence
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                These are light pre-wave reflections. They help you arrive with
                more clarity before the collective journey begins.
              </p>

              <div className="mt-6 space-y-4">
                {holding.prompts.map((prompt, index) => (
                  <div
                    key={prompt}
                    className="rounded-2xl border border-zinc-700 bg-zinc-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Prompt {index + 1}
                    </p>
                    <p className="mt-2 text-base leading-7 text-zinc-200">
                      {prompt}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="space-y-6">
              <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Wave naming
                </p>

                <h2 className="mt-3 text-xl font-semibold text-white">
                  Possible Wave name directions
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  We can later make this a real selection flow. For now, here
                  are naming tones the experience can grow toward.
                </p>

                <div className="mt-5 grid gap-3">
                  {holding.waveNameOptions.map((option) => (
                    <div
                      key={option}
                      className="rounded-2xl border border-zinc-700 bg-zinc-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] px-4 py-3 text-sm text-zinc-200"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Before the Wave begins
                </p>

                <h2 className="mt-3 text-xl font-semibold text-white">
                  A gentler way to arrive
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  You are not behind. You are arriving. These reminders help set
                  the tone before the collective journey opens.
                </p>

                <div className="mt-5 space-y-4">
                  {holding.arrivalNotes.map((note) => (
                    <div
                      key={note.title}
                      className="rounded-2xl border border-zinc-700 bg-zinc-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] p-5"
                    >
                      <p className="text-sm font-medium text-zinc-100">
                        {note.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-zinc-400">
                        {note.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (context.progression.phase === "COMPLETED") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
            Journey Complete
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-white">
            Your Wave has completed its 10-week journey
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-300">
            The live Wave progression has finished. This space can later become
            your archive, synthesis, or post-journey transition layer.
          </p>
        </div>
      </main>
    );
  }

  const weekNumber = context.progression.weekNumber!;
  const dayNumber = context.progression.dayNumber!;
  const phase = context.progression.phase;

  const content = await getCurrentDayContent({
    phase,
    weekNumber,
    dayNumber,
  });

  const completed = await hasCompletedWaveDay({
    userId,
    cohortId: context.wave.id,
    weekNumber,
    dayNumber,
  });

  const liteMirror = await isLiteMirrorEligible({
    userId,
    cohortId: context.wave.id,
    activatedAt: context.membership.activatedAt,
  });

  const fullMirror = isFullMirrorEligible(weekNumber);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
          {phase === "INTEGRATION" ? "Integration" : "Active Wave"}
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {content.title}
        </h1>

        <p className="mt-4 text-base leading-7 text-zinc-300">
          {content.prompt}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] p-5">
            <p className="text-sm font-medium text-zinc-200">Wave</p>
            <p className="mt-2 text-zinc-400">{context.wave.name}</p>
          </div>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] p-5">
            <p className="text-sm font-medium text-zinc-200">Shared position</p>
            <p className="mt-2 text-zinc-400">
              Week {weekNumber}, Day {dayNumber}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] p-5">
            <p className="text-sm font-medium text-zinc-200">Today completed</p>
            <p className="mt-2 text-zinc-400">{completed ? "Yes" : "No"}</p>
          </div>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] p-5">
            <p className="text-sm font-medium text-zinc-200">Mirror access</p>
            <div className="mt-2 space-y-1 text-zinc-400">
              <p>Lite Mirror: {liteMirror ? "Unlocked" : "Locked"}</p>
              <p>Full Mirror: {fullMirror ? "Unlocked" : "Locked"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}