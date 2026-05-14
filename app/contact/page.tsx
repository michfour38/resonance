import { SiteShell } from "@/components/site/site-shell";

import { ContactBusinessDetails } from "@/components/site/sections/contact-business-details";
import { ContactHero } from "@/components/site/sections/contact-hero";
import { ContactSupport } from "@/components/site/sections/contact-support";

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactHero />

      <ContactSupport />

      <ContactBusinessDetails />
    </SiteShell>
  );
}