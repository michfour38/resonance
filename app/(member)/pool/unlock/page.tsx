export default function PoolUnlockPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-3xl border border-zinc-800/90 bg-black/55 p-6 backdrop-blur-[2px]">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Collective Pool
          </p>

          <h1 className="mt-4 text-3xl font-semibold text-white">
            Enter the Pool
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-300">
            Your 10-week Resonance Journey has completed. The next layer is the Pool.
          </p>

          <p className="mt-3 text-sm text-zinc-500">
            This is the temporary Pool payment gate placeholder.
          </p>

          <div className="mt-6">
            <a
              href="/journey"
              className="inline-flex items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] hover:bg-[#c8a96a]/10"
            >
              Return to Journey
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}