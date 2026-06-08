import { SiteShell } from "@/components/site/site-shell"
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
    <SiteShell>
      <main className="min-h-screen text-[#f4f1ea]">
        <section className="mx-auto max-w-5xl px-6 py-20">
          <img
            src="/images/harmonize/harmonize-hero.webp"
            alt="Harmonize"
            className="mx-auto mb-12 w-full max-w-4xl"
          />

          <p className="mx-auto max-w-3xl whitespace-pre-line text-center text-base leading-7 text-[#d8d2c6] md:text-lg">
            {`Harmonize is a structured relational reflection space for couples, families, friendships, business partnerships, and parallel parenting relationships who want to understand the pattern forming between them.

Private reflection remains private.
Shared repair is chosen, not extracted.`}
          </p>

          <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-lg font-medium text-[#f4f1ea]">
              Choose a starting point
            </h2>

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
                  <p className="mt-4 text-sm text-[#c6a96b]">Begin →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}