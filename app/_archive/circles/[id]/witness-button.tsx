"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
  postId: string;
  action: (formData: FormData) => Promise<void>;
}

export default function WitnessButton({ postId, action }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const formData = new FormData();
    formData.set("postId", postId);

    startTransition(async () => {
      await action(formData);
      router.refresh();
    });
  }

  if (pending) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs text-zinc-400 hover:text-zinc-600"
    >
      Witness
    </button>
  );
}