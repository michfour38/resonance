import { SiteShell } from "@/components/site/site-shell";

import { CompareCompass } from "@/components/site/sections/compare-compass";
import { CompareCurrent } from "@/components/site/sections/compare-current";
import { CompareFinalGuidance } from "@/components/site/sections/compare-final-guidance";
import { CompareHarmonize } from "@/components/site/sections/compare-harmonize";
import { CompareHero } from "@/components/site/sections/compare-hero";
import { CompareResonance } from "@/components/site/sections/compare-resonance";

export default function ComparePage() {
  return (
    <SiteShell>
      <CompareHero />

      <CompareResonance />

      <CompareCompass />

      <CompareHarmonize />

      <CompareCurrent />

      <CompareFinalGuidance />
    </SiteShell>
  );
}