export default function OremeaLandingPage() {
  return (
    <main className="flex min-h-screen items-end justify-center px-6 pb-10 pt-10 text-white">
      
      {/* Logo */}
      <div className="fixed top-6 md:top-8 left-1/2 z-20 -translate-x-1/2">
        <img
          src="/images/oremea-logo-wht.png"
          alt="Oremea"
          className="h-28 md:h-36 w-auto opacity-90"
          style={{
            filter:
              "drop-shadow(0 0 10px rgba(0,0,0,0.35))",
          }}
        />
      </div>

      {/* bottom gradient */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-[46vh] bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      {/* content */}
      <div
        className="relative z-10 w-full"
        style={{
          width: "min(calc(100vh * 1024 / 1820), 92vw)",
          maxWidth: "520px",
        }}
      >
        <p className="mt-5 max-w-[30rem] text-base leading-8 text-zinc-200">
          A guided experience for self-reflection, relational growth, and the
          kind of clarity that comes through lived experience.
        </p>

<div className="mt-8 flex flex-col gap-3 sm:flex-row">
  <a
    href="/oremea/enter"
    className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 bg-transparent px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10"
  >
    Begin
  </a>
</div>
      </div>

    </main>
  );
}