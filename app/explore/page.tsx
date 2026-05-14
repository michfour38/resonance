import { SiteShell } from "@/components/site/site-shell";

import { ExploreCreatorPartnerships } from "@/components/site/sections/explore-creator-partnerships";
import { ExploreEcosystem } from "@/components/site/sections/explore-ecosystem";
import { ExploreHero } from "@/components/site/sections/explore-hero";
import { ExplorePrivacySafety } from "@/components/site/sections/explore-privacy-safety";
import { ExploreRecognitionTools } from "@/components/site/sections/explore-recognition-tools";
import { ExploreStartingPoint } from "@/components/site/sections/explore-starting-point";
import { ExploreWhatIs } from "@/components/site/sections/explore-what-is";
import { ExploreWhatNot } from "@/components/site/sections/explore-what-not";

export default function ExplorePage() {
  return (
    <SiteShell>
      <ExploreHero />

      <ExploreWhatIs />

      <ExploreWhatNot />

      <ExploreStartingPoint />

      <ExploreEcosystem />

      <ExploreRecognitionTools />

      <ExploreCreatorPartnerships />

      <ExplorePrivacySafety />
    </SiteShell>
  );
}