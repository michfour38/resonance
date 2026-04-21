import type { ReactNode } from "react";

export default function OremeaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0">
        {/* Desktop background */}
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
          style={{
            backgroundImage: "url('/images/desktop/oremea-bg-desktop.webp')",
          }}
        />

        {/* Mobile background */}
        <div
          className="absolute inset-0 block bg-cover bg-center bg-no-repeat md:hidden"
          style={{
            backgroundImage: "url('/images/mobile/oremea-bg-mobile.webp')",
          }}
        />
      </div>

      <div className="fixed inset-0 bg-black/15" />

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(214,160,88,0.12),transparent_45%),linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5))]" />

      <div className="relative z-10 min-h-screen flex flex-col">
  <div className="flex-1">{children}</div>

  <footer className="px-6 py-6 text-center text-xs text-zinc-400">
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
      <a href="/terms" className="hover:text-white transition">
        Terms
      </a>
      <a href="/privacy" className="hover:text-white transition">
        Privacy
      </a>
      <a href="/disclaimer" className="hover:text-white transition">
        Disclaimer
      </a>
      <a href="/refunds" className="hover:text-white transition">
        Refunds
      </a>
      <a href="/conduct" className="hover:text-white transition">
        Conduct
      </a>
    </div>

    <p className="mt-4 text-[10px] text-zinc-500">
      © {new Date().getFullYear()} Oremea
    </p>
  </footer>
</div>
    </div>
  );
}