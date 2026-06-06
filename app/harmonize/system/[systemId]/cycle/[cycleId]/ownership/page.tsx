"use client"

import Link from "next/link"
import { useState } from "react"

export default function HarmonizeOwnershipPage({
  params,
}: {
  params: { systemId: string; cycleId: string }
}) {
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  async function saveEntry() {
    setSaving(true)
    setSaved(false)
    setError("")

    try {
      const response = await fetch("/api/harmonize/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cycleId: params.cycleId,
          scope: "private",
          content,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to save ownership")
      }

      setContent("")
      setSaved(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong saving your ownership response.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#f4f1ea]">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
        <Link
          href={`/harmonize/system/${params.systemId}/cycle/${params.cycleId}/recognition`}
          className="mb-8 text-sm text-[#c6a96b]"
        >
          ← Back to recognition
        </Link>

        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
          Ownership
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          What becomes visible within yourself?
        </h1>

        <p className="mt-6 text-base leading-7 text-[#d8d2c6]">
          Ownership is not blame. It is the moment you begin seeing what belongs
          to you without making everything your fault.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xl leading-8 text-[#f4f1ea]">
            What do you usually conceal in that moment?
          </p>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write privately here..."
            className="mt-6 min-h-[180px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-[#f4f1ea] outline-none placeholder:text-[#777] focus:border-[#c6a96b]/60"
          />

          {saved ? (
            <p className="mt-4 text-sm text-[#c6a96b]">Saved privately.</p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={saveEntry}
            disabled={saving || !content.trim()}
            className="mt-5 rounded-full bg-[#c6a96b] px-6 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save ownership"}
          </button>
        </div>

        <Link
          href={`/harmonize/system/${params.systemId}/cycle/${params.cycleId}/integration`}
          className="mt-8 inline-flex w-fit rounded-full bg-[#c6a96b] px-6 py-3 text-sm font-medium text-black"
        >
          Continue to integration
        </Link>
      </section>
    </main>
  )
}