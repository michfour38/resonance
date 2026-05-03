import Link from "next/link";

const products = [
  {
    name: "Resonance",
    label: "Live now",
    description:
      "A guided self-reflection journey for people who want to understand their relational patterns with more honesty, structure, and depth.",
  },
  {
    name: "Harmonize",
    label: "Coming later",
    description:
      "A relational clarity layer for couples or two people who want to understand the pattern between them without turning conflict into blame.",
  },
  {
    name: "The Compass",
    label: "Coming later",
    description:
      "A decision and execution layer that turns awareness into one clear next step.",
  },
  {
    name: "The Current",
    label: "Coming later",
    description:
      "A future meeting space for people who have moved through the work and want to meet others with greater depth and intention.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090806] text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c8a96a]">
            Oremea
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Return to what is already within you.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300">
            Oremea is a house of reflective products for pattern awareness,
            relational clarity, and self-led recognition.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/oremea/enter"
              className="rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10"
            >
              Enter Resonance
            </Link>

            <Link
              href="/oremea"
              className="rounded-xl border border-white/15 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              View Oremea products
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.name}
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl text-white">{product.name}</h2>
                <span className="text-xs uppercase tracking-[0.18em] text-[#c8a96a]/80">
                  {product.label}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}