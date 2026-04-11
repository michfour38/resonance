"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

interface PostComposerProps {
  circleId: string;
  promptId: string;
  action: (formData: FormData) => Promise<void>;
}

export default function PostComposer({
  circleId,
  promptId,
  action,
}: PostComposerProps) {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await action(formData);
    ref.current?.reset();
    router.refresh();
  }

  return (
    <form ref={ref} action={handleSubmit} className="space-y-3">
      <input type="hidden" name="circleId" value={circleId} />
      <input type="hidden" name="promptId" value={promptId} />

      <textarea
        name="content"
        placeholder="Share something real..."
        rows={3}
        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm"
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-xl text-sm"
      >
        Share reflection
      </button>
    </form>
  );
}