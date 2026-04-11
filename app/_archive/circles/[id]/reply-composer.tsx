"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface ReplyComposerProps {
  circleId: string;
  parentId: string;
  promptId: string;
  action: (formData: FormData) => Promise<void>;
}

export default function ReplyComposer({
  circleId,
  parentId,
  promptId,
  action,
}: ReplyComposerProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await action(formData);
    ref.current?.reset();
    setOpen(false);
    setExpanded(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-zinc-500 hover:text-zinc-700"
      >
        Respond
      </button>
    );
  }

  return (
    <form
      ref={ref}
      action={handleSubmit}
      className="mt-2 space-y-3 rounded-xl border border-zinc-200 bg-white p-3"
    >
      <input type="hidden" name="circleId" value={circleId} />
      <input type="hidden" name="parentId" value={parentId} />
      <input type="hidden" name="promptId" value={promptId} />

      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-xs text-zinc-400 hover:text-zinc-600"
        >
          Respond more deeply
        </button>
      )}

      <textarea
        name="content"
        placeholder={
          expanded ? "Respond with presence..." : "Write a response..."
        }
        rows={expanded ? 4 : 2}
        className="w-full resize-none bg-transparent px-0 py-0 text-sm outline-none"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-black px-4 py-2 text-xs text-white"
        >
          Reply
        </button>

        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setExpanded(false);
          }}
          className="text-xs text-zinc-400 hover:text-zinc-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}