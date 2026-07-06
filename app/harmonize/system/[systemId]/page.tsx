"use client"

import MemberNav from "@/app/(member)/member-nav"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function cycleHref(systemId: string, cycle: any) {
  if (cycle.status === "paused") {
    return `/harmonize/system/${systemId}/cycle/${cycle.id}/pause`
  }

  if (cycle.status === "reviewed") {
    return `/harmonize/system/${systemId}/cycle/${cycle.id}/complete`
  }

  if (cycle.status === "review_due") {
    return `/harmonize/system/${systemId}/cycle/${cycle.id}/review`
  }

  return `/harmonize/system/${systemId}/cycle/${cycle.id}/private`
}

function modeLabel(mode?: string) {
  if (mode === "couple") return "Couple Container"
  if (mode === "family_adults") return "Family Adults Container"
  if (mode === "team") return "Team Container"
  if (mode === "parallel_parenting_adults") {
    return "Parallel Parenting Container"
  }

  return "Harmonize Container"
}

const TITLE_SUGGESTIONS = [
  "Trust",
  "Communication",
  "Boundaries",
  "Responsibility",
  "Repair",
  "Intimacy",
  "Parenting",
  "Money",
  "Feeling Chosen",
  "Betrayal",
]

export default function HarmonizeSystemPage({
  params,
}: {
  params: { systemId: string }
}) {
  const router = useRouter()

  const [system, setSystem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState("")
  const [cycleTitle, setCycleTitle] = useState("")
  const [showInvitePanel, setShowInvitePanel] = useState(false)

const waitingCycles =
  system?.cycles?.filter(
    (cycle: any) => !cycle.hasPrivateWitness,
  ) ?? []

const canStartAnotherConversation =
  waitingCycles.length === 0

  useEffect(() => {
    async function loadSystem() {
      try {
        const response = await fetch(
          `/api/harmonize/system/summary?systemId=${params.systemId}`,
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to load system")
        }

        setSystem(data.system)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong loading this container.",
        )
      } finally {
        setLoading(false)
      }
    }

    loadSystem()
  }, [params.systemId])

  async function startCycle() {
    if (starting) return

    setStarting(true)
    setError("")

    try {
      const response = await fetch("/api/harmonize/cycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemId: params.systemId,
          title: cycleTitle.trim() || "Untitled Conversation",
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to begin conversation")
      }

      router.push(
        `/harmonize/system/${params.systemId}/cycle/${data.cycle.id}/private`,
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong beginning this conversation.",
      )
    } finally {
      setStarting(false)
    }
  }

  return (
    <>
      <MemberNav />

      <main
        className="min-h-screen text-[#f4f1ea]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.74), rgba(0,0,0,0.74)), url('/images/harmonize/bg-harmonize-private.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <section className="mx-auto max-w-5xl px-6 py-20">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
            Harmonize by Oremea
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {modeLabel(system?.mode)}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#d8d2c6]">
            This is the shared container. Private witness remains private.
            Conversations are held inside this container. Shared space only
            becomes meaningful when participants choose to bring something
            forward.
          </p>

          {loading ? (
            <p className="mt-8 text-sm text-[#bfb8aa]">
              Loading container...
            </p>
          ) : null}

          {error ? (
            <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          {system ? (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-[#c6a96b]/30 bg-[#c6a96b]/10 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#c6a96b]">
                    Participants
                  </p>
                  <p className="mt-4 text-3xl font-semibold">
                    {system.participants?.length || 0}
                  </p>
                  <p className="mt-2 text-sm text-[#d8d2c6]">
                    People currently connected to this container.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#c6a96b]">
                    Conversations
                  </p>
                  <p className="mt-4 text-3xl font-semibold">
                    {system.cycles?.length || 0}
                  </p>
                  <p className="mt-2 text-sm text-[#d8d2c6]">
                    Shared threads inside this relationship space.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#c6a96b]">
                    Container status
                  </p>
                  <p className="mt-4 text-3xl font-semibold capitalize">
                    {system.status}
                  </p>
                  <p className="mt-2 text-sm text-[#d8d2c6]">
                    This container remains active while the relationship space is
                    open.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium text-[#f4f1ea]">
                      Participants
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#bfb8aa]">
                      Everyone listed below belongs to this container. Container
                      creation is administrative only and gives no additional
                      authority inside the conversation. Every participant's
                      private witness remains private unless they intentionally
                      choose to share it.
                    </p>
                  </div>

                  <button
  type="button"
  onClick={() => setShowInvitePanel((value) => !value)}
  className="rounded-full border border-[#c6a96b]/40 px-5 py-2 text-sm font-medium text-[#c6a96b]"
>
  Add participant
</button>
                </div>

                <div className="mt-5 space-y-3">
                  {system.participants?.map((participant: any) => (
                    <div
                      key={participant.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-sm font-medium text-[#f4f1ea]">
                        {participant.displayName}
                      </p>

                      <p className="mt-1 text-xs text-[#8f8778]">
                        {participant.isOwner
                          ? "Container Creator"
                          : participant.active
                            ? "Participant"
                            : "Invitation Pending"}
                      </p>

                      {participant.relationshipContext ? (
                        <p className="mt-2 text-xs text-[#c6a96b]">
                          {participant.relationshipContext}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

{showInvitePanel ? (
  <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
    <p className="text-sm font-medium text-[#f4f1ea]">
      Add participant
    </p>

    <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
      Invite another participant into this container.
      Their Private Witness remains private unless they choose to share it.
    </p>

    <Link
      href={`/harmonize/system/${params.systemId}/invite`}
      className="mt-5 inline-flex rounded-full bg-[#c6a96b] px-5 py-2 text-sm font-medium text-black"
    >
      Continue
    </Link>
  </div>
) : null}

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-lg font-medium text-[#f4f1ea]">
                  What this container holds
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-medium text-[#f4f1ea]">
                      Private Witness
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
                      Each participant writes privately first. Nothing is shared
                      automatically.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-medium text-[#f4f1ea]">
                      Pattern Between
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
                      Patterns only become available when there is enough safe
                      material to reflect.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-medium text-[#f4f1ea]">
                      Shared Space
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
                      Shared discussion is chosen. Harmful speech should be
                      stopped and returned to private witness.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-lg font-medium text-[#f4f1ea]">
                  Conversations in this container
                </h2>

                {!system.cycles?.length ? (
                  <p className="mt-4 text-sm leading-6 text-[#bfb8aa]">
                    No conversations have been started yet.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {system.cycles.map((cycle: any, index: number) => (
                      <Link
                        key={cycle.id}
                        href={cycleHref(params.systemId, cycle)}
                        className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-[#c6a96b]/60 hover:bg-[#c6a96b]/10"
                      >
                        <p className="text-sm font-medium text-[#f4f1ea]">
                          {cycle.hasPrivateWitness
                            ? cycle.displayTitle
                            : `Conversation ${index + 1}`}
                        </p>

                        {cycle.hasPrivateWitness ? (
                          <p className="mt-2 text-xs text-[#777]">
                            Continue your private witness.
                          </p>
                        ) : (
                          <>
                            <p className="mt-2 text-xs text-[#777]">
                              Another participant has started this conversation.
                            </p>

                            <p className="mt-2 text-xs text-[#c6a96b]">
                              Begin your private witness.
                            </p>
                          </>
                        )}

                        <p className="mt-3 text-[11px] text-[#666]">
                          Started{" "}
                          {cycle.started_at
                            ? new Date(cycle.started_at).toLocaleString()
                            : "Unknown"}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {canStartAnotherConversation ? (
  <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
    <h2 className="text-lg font-medium text-[#f4f1ea]">
      Start another conversation
    </h2>

    <p className="mt-3 text-sm leading-6 text-[#bfb8aa]">
      Begin a new shared thread when this relationship is ready to explore a
      different topic. Existing conversations remain available to return to at
      any time.
    </p>

    <input
      value={cycleTitle}
      onChange={(event) => setCycleTitle(event.target.value)}
      placeholder="What would you call this conversation?"
      className="mt-5 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#f4f1ea] outline-none placeholder:text-[#777] focus:border-[#c6a96b]/60"
    />

    <div className="mt-3 flex flex-wrap gap-2">
      {TITLE_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => setCycleTitle(suggestion)}
          className="rounded-full border border-[#c6a96b]/30 px-3 py-1 text-xs text-[#c6a96b] transition hover:bg-[#c6a96b]/10"
        >
          {suggestion}
        </button>
      ))}
    </div>

    <button
      type="button"
      onClick={startCycle}
      disabled={starting}
      className="mt-5 inline-flex rounded-full bg-[#c6a96b] px-5 py-2 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-60"
    >
      {starting ? "Beginning..." : "+ Start another conversation"}
    </button>
  </div>
) : (
  <div className="mt-8 rounded-3xl border border-[#c6a96b]/30 bg-[#c6a96b]/10 p-6">
    <h2 className="text-lg font-medium text-[#f4f1ea]">
      Waiting for your participation
    </h2>

    <p className="mt-3 text-sm leading-6 text-[#d8d2c6]">
      There {waitingCycles.length === 1 ? "is" : "are"}{" "}
      {waitingCycles.length} conversation
      {waitingCycles.length === 1 ? "" : "s"} waiting for your private
      witness.

      Complete your participation before starting another conversation.
    </p>

    <Link
      href={cycleHref(params.systemId, waitingCycles[0])}
      className="mt-6 inline-flex rounded-full bg-[#c6a96b] px-5 py-2 text-sm font-medium text-black"
    >
      Go to next conversation
    </Link>
  </div>
)}
            </>
          ) : null}
        </section>
      </main>
    </>
  )
}