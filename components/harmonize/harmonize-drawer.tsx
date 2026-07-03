"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

function modeLabel(mode?: string) {
  if (mode === "couple") return "Couple Container"
  if (mode === "family_adults") return "Family Adults Container"
  if (mode === "team") return "Team Container"
  if (mode === "parallel_parenting_adults") return "Parallel Parenting"
  return "Harmonize Container"
}

function DrawerSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[#8f7a4d]">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function DrawerLink({
  href,
  children,
  onClick,
  muted = false,
}: {
  href: string
  children: React.ReactNode
  onClick: () => void
  muted?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-2xl border px-4 py-3 text-sm transition ${
        muted
          ? "border-white/10 bg-white/[0.02] text-[#8f8778] hover:border-[#c6a96b]/30 hover:text-[#c6a96b]"
          : "border-white/10 bg-white/[0.05] text-[#f4f1ea] hover:border-[#c6a96b]/50 hover:bg-[#c6a96b]/10"
      }`}
    >
      {children}
    </Link>
  )
}

export function HarmonizeDrawer({
  systemId,
  cycleId,
}: {
  systemId: string
  cycleId?: string
}) {
  const [open, setOpen] = useState(false)
  const [system, setSystem] = useState<any>(null)
  const [cycle, setCycle] = useState<any>(null)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    async function loadContext() {
      try {
        const systemResponse = await fetch(
          `/api/harmonize/system/summary?systemId=${systemId}`,
        )
        const systemData = await systemResponse.json()

        if (systemResponse.ok && systemData.success) {
          setSystem(systemData.system)
        }

        if (cycleId) {
          const cycleResponse = await fetch(
            `/api/harmonize/cycle/summary?cycleId=${cycleId}`,
          )
          const cycleData = await cycleResponse.json()

          if (cycleResponse.ok && cycleData.success) {
            setCycle(cycleData.cycle)
          }
        }
      } catch {
        // Drawer still works as navigation if context lookup fails.
      }
    }

    loadContext()
  }, [systemId, cycleId])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-5 top-5 z-40 rounded-full border border-[#c6a96b]/40 bg-black/70 px-4 py-2 text-sm text-[#c6a96b] shadow-lg backdrop-blur transition hover:border-[#c6a96b]/70 hover:bg-[#c6a96b]/10"
      >
        Harmonize
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm">
          <aside className="fixed right-0 top-0 flex h-dvh max-h-dvh w-full max-w-sm flex-col overflow-y-auto border-l border-[#c6a96b]/20 bg-[#0b0b0b]/95 p-6 text-[#f4f1ea] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
                  Harmonize
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  {cycle?.displayTitle || modeLabel(system?.mode)}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#8f8778]">
                  {cycleId
                    ? "Current conversation inside this container."
                    : "Current relationship container."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#c6a96b] transition hover:border-[#c6a96b]/50"
              >
                Close
              </button>
            </div>

            <div className="mt-8 rounded-3xl border border-[#c6a96b]/25 bg-[#c6a96b]/10 p-5">
              
              {cycleId ? (
                <p className="mt-3 text-lg font-medium text-[#f4f1ea]">
                  {cycle?.displayTitle || "Conversation"}
                </p>
              ) : null}

              <p className="mt-2 text-sm leading-6 text-[#d8d2c6]">
                {modeLabel(system?.mode)}
              </p>

              {(() => {
  const participantCount = system?.participants?.length ?? 0
  const conversationCount = system?.cycles?.length ?? 0

  return (
    <p className="mt-1 text-xs text-[#8f8778]">
      {participantCount}{" "}
      {participantCount === 1 ? "participant" : "participants"} ·{" "}
      {conversationCount}{" "}
      {conversationCount === 1 ? "conversation" : "conversations"}
    </p>
  )
})()}
            </div>

            <nav className="mt-8 space-y-7">
              {cycleId ? (
                <DrawerSection title="Conversation Pages">
                  <DrawerLink
                    href={`/harmonize/system/${systemId}/cycle/${cycleId}/private`}
                    onClick={() => setOpen(false)}
                  >
                    Private Witness
                  </DrawerLink>

                  <DrawerLink
                    href={`/harmonize/system/${systemId}/cycle/${cycleId}/loop`}
                    onClick={() => setOpen(false)}
                  >
                    Pattern Between
                  </DrawerLink>

                  <DrawerLink
                    href={`/harmonize/system/${systemId}/cycle/${cycleId}/shared`}
                    onClick={() => setOpen(false)}
                  >
                    Shared Space
                  </DrawerLink>

                  <DrawerLink
                    href={`/harmonize/system/${systemId}/cycle/${cycleId}/review`}
                    onClick={() => setOpen(false)}
                  >
                    Review & Completion
                  </DrawerLink>
                </DrawerSection>
              ) : null}

              <DrawerSection title={modeLabel(system?.mode)}>
                <DrawerLink
                  href={`/harmonize/system/${systemId}`}
                  onClick={() => setOpen(false)}
                >
                  Conversations
                </DrawerLink>

                <DrawerLink
                  href={`/harmonize/system/${systemId}`}
                  onClick={() => setOpen(false)}
                >
                  Begin New Conversation
                </DrawerLink>

                <DrawerLink
                  href={`/harmonize/system/${systemId}/invite`}
                  onClick={() => setOpen(false)}
                >
                  Invite Participants
                </DrawerLink>
              </DrawerSection>

              <DrawerSection title="Harmonize">
                <DrawerLink href="/harmonize" onClick={() => setOpen(false)}>
                  Your Containers
                </DrawerLink>

                <DrawerLink
                  href="/harmonize/start"
                  onClick={() => setOpen(false)}
                >
                  Create Another Container
                </DrawerLink>
              </DrawerSection>

              <DrawerSection title="History">
                <DrawerLink href="/harmonize" onClick={() => setOpen(false)} muted>
                  Completed Conversations
                </DrawerLink>

                <DrawerLink href="/harmonize" onClick={() => setOpen(false)} muted>
                  Archived Containers
                </DrawerLink>
              </DrawerSection>
            </nav>

            <p className="pt-8 text-xs leading-5 text-[#777]">
              Private reflections remain private. Shared repair is chosen, not
              extracted.
            </p>
          </aside>
        </div>
      ) : null}
    </>
  )
}