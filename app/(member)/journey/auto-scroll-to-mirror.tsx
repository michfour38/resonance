"use client";

import { useEffect } from "react";

export default function AutoScrollToMirror({
  trigger,
}: {
  trigger: boolean;
}) {
  useEffect(() => {
    if (!trigger) return;

    const timer = setTimeout(() => {
      const el = document.getElementById("mirror");
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 400); // wait for UI render

    return () => clearTimeout(timer);
  }, [trigger]);

  return null;
}