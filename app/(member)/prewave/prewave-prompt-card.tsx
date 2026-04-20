type PreWavePromptCardProps = {
  cohortId: string;
  questionNumber: number;
  question: string;
  unlocked: boolean;
  existingResponse: string;
  pathway: string;
  onSave: (formData: FormData) => Promise<void>;
};

export default function PreWavePromptCard({
  cohortId,
  questionNumber,
  question,
  unlocked,
  existingResponse,
  pathway,
  onSave,
}: PreWavePromptCardProps) {
  const hasSavedResponse = Boolean(existingResponse.trim());

  if (!unlocked) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-black/40 backdrop-blur-[2px] px-6 py-6 opacity-75">
        <p className="select-none text-sm leading-7 text-zinc-500 blur-[5px]">
          {question}
        </p>

        <p className="mt-3 text-xs leading-6 text-zinc-500">
          This reflection unlocks on its day.
        </p>
      </div>
    );
  }

  if (hasSavedResponse) {
    return (
      <div className="space-y-5 rounded-3xl border border-amber-400/35 bg-gradient-to-br from-amber-400/[0.08] via-amber-400/[0.03] to-black/60 px-6 py-6 shadow-[0_0_0_1px_rgba(251,191,36,0.04)]">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Reflection {questionNumber} of 6
          </p>

          <h2 className="text-2xl font-semibold text-white">
            {question}
          </h2>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-black/40 backdrop-blur-[1px] px-4 py-4">
          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
            {existingResponse}
          </p>
        </div>

        <div className="flex justify-end">
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/20 px-4 py-2 text-sm text-amber-100">
            Completed
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-700/80 bg-black/45 backdrop-blur-[2px] px-6 py-6">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        Reflection {questionNumber} of 6
      </p>

      <h2 className="mt-3 text-2xl font-semibold text-white">
        {question}
      </h2>

      <form action={onSave} className="mt-6 space-y-4">
        <input type="hidden" name="cohortId" value={cohortId} />
        <input type="hidden" name="questionIndex" value={questionNumber} />
        <input
          type="hidden"
          name="returnTo"
          value={`/prewave?pathway=${pathway}&saved=1`}
        />

        <textarea
          name="response"
          defaultValue={existingResponse}
          rows={6}
          className="w-full resize-none rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#c8a96a]/30"
          placeholder="Write what feels true..."
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10"
          >
            Save reflection
          </button>
        </div>
      </form>
    </div>
  );
}