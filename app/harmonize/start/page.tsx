import Link from "next/link"

const modes = [
  {
    key: "couple",
    title: "Couple",
    description: "For two adults navigating a relationship pattern together.",
  },
  {
    key: "family_adults",
    title: "Family Adults",
    description: "For adult family members navigating recurring family dynamics.",
  },
  {
    key: "team",
    title: "Team",
    description:
      "For teams navigating communication, trust, responsibility, and repair.",
  },
  {
    key: "parallel_parenting_adults",
    title: "Parallel Parenting Adults",
    description:
      "For separated parents who need structure, boundaries, and child-centered coordination without forced emotional exposure.",
  },
]

export default function HarmonizeStartPage() {
  return (
    <main
      className="min-h-screen text-[#f4f1ea]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.72)), url('/images/harmonize/bg-harmonize-entry.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-20">
        <Link
          href="/harmonize"
          className="mb-8 text-sm text-[#c6a96b] hover:underline"
        >
          ← Back to containers
        </Link>

        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
          Harmonize by Oremea
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Create a container
        </h1>

        <p className="mt-6 text-base leading-7 text-[#d8d2c6]">
          Choose the relationship structure this container will hold. Each
          container keeps its own conversations separate while Harmonize can
          continue recognizing patterns over time.
        </p>

        <div className="mt-8 rounded-3xl border border-[#c6a96b]/30 bg-[#c6a96b]/10 p-6">
          <h2 className="text-lg font-medium text-[#f4f1ea]">
            Harmonize Pricing
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-6 text-[#d8d2c6]">
            <p>
              Harmonize includes <strong>2 participants</strong> at{" "}
              <strong>R1200/month</strong>.
            </p>

            <p>
              Additional participants are <strong>R300/month</strong> each.
            </p>

            <p>
              Self-serve containers support up to{" "}
              <strong>10 participants</strong>.
            </p>

            <p>
              Larger groups, organizations, schools, communities, and extended
              family systems can request a custom setup.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {modes.map((mode) => (
            <Link
              key={mode.key}
              href={`/harmonize/agreement?mode=${mode.key}`}
              className="group rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-[#c6a96b]/60 hover:bg-[#c6a96b]/10"
            >
              <h3 className="text-lg font-medium text-[#f4f1ea]">
                {mode.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
                {mode.description}
              </p>

              <p className="mt-4 text-sm text-[#c6a96b]">Continue →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}