"use client";

import { useState } from "react";

import { SiteShell } from "@/components/site/site-shell";

import { CompareCompass } from "@/components/site/sections/compare-compass";
import { CompareFinalGuidance } from "@/components/site/sections/compare-final-guidance";
import { CompareHero } from "@/components/site/sections/compare-hero";
import { CompareResonance } from "@/components/site/sections/compare-resonance";

export type CompareMode = "experience" | "understand";

export default function ComparePage() {
  const [mode, setMode] = useState<CompareMode>("experience");

  return (
    <SiteShell>
      <CompareHero mode={mode} setMode={setMode} />

      <CompareResonance mode={mode} />

      <CompareCompass mode={mode} />

      <CompareFinalGuidance />
    </SiteShell>
  );
}
