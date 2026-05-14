import { ReactNode } from "react";

import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />

      <main>{children}</main>

      <SiteFooter />
    </div>
  );
}