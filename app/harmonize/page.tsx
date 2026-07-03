"use client"

import { SiteShell } from "@/components/site/site-shell"
import Link from "next/link"
import { useEffect, useState } from "react"

function modeLabel(mode?: string) {
  if (mode === "couple") return "Couple"
  if (mode === "family_adults") return "Family Adults"
  if (mode === "team") return "Team"
  if (mode === "parallel_parenting_adults") return "Parallel Parenting Adults"
  return "Harmonize"
}

export default function HarmonizePage() {
  const [systems, setSystems] = useState<any[]>([])
  const [loadingSystems, setLoadingSystems] = useState(true)

  useEffect(() => {
    async function loadSystems() {
      try {
        const response = await fetch("/api/harmonize/systems")
        const data = await response.json()

        if (response.ok && data.success) {
          setSystems(data.systems || [])
        }
      } catch {
        // Keep page usable if lookup fails.
      } finally {
        setLoadingSystems(false)
      }
    }

    loadSystems()
  }, [])

  return (
    <SiteShell>
      <main
        className="min-h-screen text-[#f4f1ea]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.70)), url('/images/harmonize/bg-harmonize-entry.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <section className="mx-auto max-w-5xl px-6 pt-6 pb-20">
          <img
            src="/images/harmonize/harmonize-hero.webp"
            alt="Harmonize"
            className="mx-auto mb-4 w-full max-w-[200px]"
          />

          <p className="mx-auto -mt-2 max-w-4xl whitespace-pre-line text-center text-base leading-7 text-[#d8d2c6] md:text-lg">
            {`Harmonize is a structured relational reflection space for couples, families, friendships, business partnerships,
and parallel parenting relationships who want to understand the pattern forming between them.`}
          </p>

          <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-lg font-medium text-[#f4f1ea]">
              Your Harmonize containers
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#bfb8aa]">
              Keep separate relationship systems in separate containers while
              Harmonize continues recognizing the wider pattern across time.
            </p>

            {loadingSystems ? (
              <p className="mt-6 text-sm text-[#bfb8aa]">
                Checking for containers...
              </p>
            ) : null}

            {!loadingSystems && !systems.length ? (
              <p className="mt-6 text-sm leading-6 text-[#bfb8aa]">
                No containers yet.
              </p>
            ) : null}

            {systems.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {systems.map((system) => (
                  <Link
                    key={system.id}
                    href={`/harmonize/system/${system.id}`}
                    className="block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-[#c6a96b]/60 hover:bg-[#c6a96b]/10"
                  >
                    <h3 className="text-lg font-medium text-[#f4f1ea]">
                      {system.name || modeLabel(system.mode)}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
                      {modeLabel(system.mode)}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
                      Participants: {system.participants?.length || 0}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
                      Conversations: {system.cycles?.length || 0}
                    </p>

                    <p className="mt-4 text-sm text-[#c6a96b]">
                      Resume container →
                    </p>
                  </Link>
                ))}
              </div>
            ) : null}

            <Link
              href="/harmonize/start"
              className="mt-8 inline-flex rounded-full bg-[#c6a96b] px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
            >
              + Create a Container
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}