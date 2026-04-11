export default function OremeaBeginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-black/35 p-8 backdrop-blur-sm md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
          Oremea
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Return to what is already within you.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-zinc-200">
          A guided experience for self-reflection and relational growth.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-xl border border-amber-300/40 bg-amber-200/10 px-5 py-3 text-sm text-amber-100 transition hover:bg-amber-200/20">
            Begin
          </button>

          <button className="rounded-xl border border-white/10 bg-black/20 px-5 py-3 text-sm text-zinc-200 transition hover:bg-white/5">
            I’m just looking
          </button>
        </div>
      </div>
    </main>
  );
}