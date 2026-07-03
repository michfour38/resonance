"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const allowedModes = [
  "couple",
  "family_adults",
  "team",
  "parallel_parenting_adults",
] as const

const modeLabels: Record<string, string> = {
  couple: "Couple",
  family_adults: "Family Adults",
  team: "Team",
  parallel_parenting_adults: "Parallel Parenting Adults",
}

export default function HarmonizeCreatePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode")

  const [loading, setLoading] = useState(false)
  const [loadingSystems, setLoadingSystems] = useState(true)
  const [existingSystem, setExistingSystem] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadExistingSystem() {
      try {
        const response = await fetch("/api/harmonize/systems")
        const data = await response.json()

        if (response.ok && data.success && data.systems?.length) {
          setExistingSystem(data.systems[0])
        }
      } catch {
        // Keep create path available if lookup fails.
      } finally {
        setLoadingSystems(false)
      }
    }

    loadExistingSystem()
  }, [])

  if (!mode || !allowedModes.includes(mode as any)) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] px-6 py-20 text-[#f4f1ea]">
        <div className="mx-auto max-w-2xl">
          <p>Invalid Harmonize mode.</p>
          <Link href="/harmonize" className="mt-4 inline-block text-[#c6a96b]">
            Return to Harmonize
          </Link>
        </div>
      </main>
    )
  }

  async function createSystem() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/harmonize/system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          consentSnapshot: {
            acceptedAt: new Date().toISOString(),
            mode,
            agreementVersion: "harmonize-v1",
            principles: [
              "Private reflections remain private",
              "Shared repair is chosen not extracted",
              "Understanding is more important than agreement",
              "Repair is invitation not obligation",
              "Harmonize does not determine who is right",
              "Participants remain responsible for their own choices",
              "Minor participation is not available in this version",
            ],
            safetyAccepted: true,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to create Harmonize system")
      }

      router.push(`/harmonize/system/${data.system.id}`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong creating the system.",
      )
    } finally {
      setLoading(false)
    }
  }

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
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
        
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
          Harmonize by Oremea
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
  Create your {modeLabels[mode]} container
</h1>

        <p className="mt-6 text-base leading-7 text-[#d8d2c6]">
          You're about to create a protected Harmonize container.
Once created, you'll continue directly into your new container.
        </p>

        {loadingSystems ? (
          <p className="mt-8 text-sm text-[#bfb8aa]">
            Checking for existing containers...
          </p>
        ) : null}

        {existingSystem ? (
          <div className="mt-8 rounded-3xl border border-[#c6a96b]/30 bg-[#c6a96b]/10 p-6">
            <h2 className="text-lg font-medium text-[#f4f1ea]">
              Resume current container
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#d8d2c6]">
              You already have a Harmonize container connected to this account.
              Continue there to keep the wider memory connected.
            </p>

            <Link
              href={`/harmonize/system/${existingSystem.id}`}
              className="mt-5 inline-flex rounded-full bg-[#c6a96b] px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
            >
              Resume container
            </Link>
          </div>
        ) : null}

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-medium">
            Create a new {modeLabels[mode]} container
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-6 text-[#bfb8aa]">
            <p>A protected Harmonize space for this relationship structure.</p>
            <p>Your participation is connected to your account.</p>
            <p>Private reflection can begin once the container is created.</p>
          </div>

          {error ? (
            <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={createSystem}
            disabled={loading}
            className="mt-8 inline-flex w-fit rounded-full bg-[#c6a96b] px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create new container"}
          </button>
        </div>
      </section>
    </main>
  )
}