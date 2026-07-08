"use client"

import { useState } from "react"
import { RELATIONSHIP_CONTEXTS } from "@/components/harmonize/invite/invite-types"

type Props = {
  systemId: string
  onSaved?: () => Promise<void> | void
}

export default function ParticipantForm({ systemId, onSaved }: Props) {
  const [email, setEmail] = useState("")
  const [relationshipContext, setRelationshipContext] = useState("Partner")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  async function saveParticipant() {
    setError("")
    setSaved(false)
    setSaving(true)

    try {
      const response = await fetch("/api/harmonize/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemId,
          invites: [
            {
              email,
              relationshipContext,
            },
          ],
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to save participant.")
      }

      setSaved(true)
      setEmail("")
      setRelationshipContext("Partner")
      await onSaved?.()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save participant.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm font-medium text-[#f4f1ea]">Add participant</p>

      <label className="mt-4 block text-sm text-[#d8d2c6]">Email</label>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="participant@example.com"
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-[#f4f1ea] outline-none placeholder:text-[#777] focus:border-[#c6a96b]/60"
      />

      <label className="mt-4 block text-sm text-[#d8d2c6]">
        Relationship
      </label>
      <select
        value={relationshipContext}
        onChange={(event) => setRelationshipContext(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-[#f4f1ea] outline-none focus:border-[#c6a96b]/60"
      >
        {RELATIONSHIP_CONTEXTS.map((context) => (
          <option key={context} value={context}>
            {context}
          </option>
        ))}
      </select>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {saved ? (
        <p className="mt-4 text-sm text-[#c6a96b]">
          Participant saved.
        </p>
      ) : null}

      <button
        type="button"
        onClick={saveParticipant}
        disabled={saving || !email.trim()}
        className="mt-5 inline-flex rounded-full bg-[#c6a96b] px-5 py-2 text-sm font-medium text-black disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save participant"}
      </button>
    </div>
  )
}