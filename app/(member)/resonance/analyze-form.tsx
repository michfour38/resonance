"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitAnalysisAction } from "./actions";

interface AnalyzeFormProps {
  completionId: string;
  existingContent: string | null;
  onClose: () => void;
}

export default function AnalyzeForm({
  completionId,
  existingContent,
  onClose,
}: AnalyzeFormProps) {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    await submitAnalysisAction(formData);

    ref.current?.reset();
    onClose();
    router.refresh();
  }

  return (
    <div className="mt-3 space-y-3">
      {/* 🔑 Tone anchor */}
      <p className="text-xs text-zinc-500">
        Let your response come from curiosity.
      </p>

      <form ref={ref} action={handleSubmit} className="space-y-3">
        <input type="hidden" name="completionId" value={completionId} />

        <textarea
          name="content"
          defaultValue={existingContent ?? ""}
          placeholder="What would you want to understand more about this?"
          rows={4}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm leading-7 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 resize-none"
        />

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="text-xs rounded-xl bg-zinc-800 px-3 py-1.5 text-white hover:bg-zinc-700 transition"
          >
            {submitting ? "Sending…" : "Send"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}