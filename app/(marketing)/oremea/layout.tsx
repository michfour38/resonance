import type { ReactNode } from "react";

export default function OremeaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background images */}
      <div className="fixed inset-0">
        {/* Desktop background */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/oremea-bg-desktop.png')",
          }}
        />

        {/* Mobile background */}
        <div
          className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/oremea-bg-mobile.png')",
          }}
        />
      </div>

{/* Softer dark overlay */}
<div className="fixed inset-0 bg-black/15" />

{/* Light cinematic warmth (subtle) */}
<div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(214,160,88,0.12),transparent_45%),linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5))]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}