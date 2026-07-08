import Link from "next/link"

const modes = [
  {
    key: "couple",
    title: "Couple",
    description: "For two adults navigating a relationship pattern together.",
    capacity: "2 participants included",
  },
  {
    key: "family_adults",
    title: "Family Adults",
    description: "For adult family members navigating recurring family dynamics.",
    capacity: "8 participants included",
  },
  {
    key: "team",
    title: "Team",
    description:
      "For teams navigating communication, trust, responsibility, and repair.",
    capacity: "25 participants included",
  },
  {
    key: "parallel_parenting_adults",
    title: "Parallel Parenting Adults",
    description:
      "For separated parents who need structure, boundaries, and child-centered coordination without forced emotional exposure.",
    capacity: "2 participants included",
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
        <Link href="/harmonize" className="mb-8 text-sm text-[#c6a96b]">
          ← Back to relationship spaces
        </Link>

        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
          Harmonize by Oremea
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Create Relationship Space
        </h1>

        <p className="mt-6 text-base leading-7 text-[#d8d2c6]">
          Choose the kind of relationship space you want to create. Each space
          holds its own participants, conversations, and patterns.
        </p>

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

              <p className="mt-4 text-sm text-[#c6a96b]">
                {mode.capacity}
              </p>

              <p className="mt-2 text-sm text-[#c6a96b]">
                Continue →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}