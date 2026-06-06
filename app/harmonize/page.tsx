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
    description: "For teams navigating communication, trust, responsibility, and repair.",
  },
  {
    key: "parallel_parenting_adults",
    title: "Parallel Parenting Adults",
    description:
      "For separated parents who need structure, boundaries, and child-centered coordination without forced emotional exposure.",
  },
]

export default function HarmonizePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#f4f1ea]">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
          Oremea
        </p>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          Develop a new perspective together.
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-7 text-[#d8d2c6] md:text-lg">
          Harmonize helps people develop a new perspective of the patterns they
          inherited, understand the experiences they navigate with another, and
          consciously build new ways of relating through awareness, ownership,
          repair, integration, and practice together.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-medium text-[#f4f1ea]">
            Choose a starting point
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
            Minor participation is not available in this version. Child access
            will remain hidden until the research, policy, and verification
            layers are complete.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {modes.map((mode) => (
              <Link
                key={mode.key}
                href={`/harmonize/start?mode=${mode.key}`}
                className="group rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-[#c6a96b]/60 hover:bg-[#c6a96b]/10"
              >
                <h3 className="text-lg font-medium text-[#f4f1ea]">
                  {mode.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
                  {mode.description}
                </p>
                <p className="mt-4 text-sm text-[#c6a96b]">
                  Begin →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}