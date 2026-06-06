import Link from "next/link"
import { redirect } from "next/navigation"

const allowedModes = [
  "couple",
  "family_adults",
  "team",
  "parallel_parenting_adults",
] as const

const agreements = [
  "Private reflections remain private.",
  "Shared repair is chosen, not extracted.",
  "Understanding is more important than agreement.",
  "Repair is invitation, not obligation.",
  "Harmonize does not determine who is right.",
  "Participants remain responsible for their own choices.",
  "Minor participation is not available in this version.",
]

export default function HarmonizeAgreementPage({
  searchParams,
}: {
  searchParams: { mode?: string }
}) {
  const mode = searchParams.mode

  if (!mode || !allowedModes.includes(mode as any)) {
    redirect("/harmonize")
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#f4f1ea]">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
        <Link
          href={`/harmonize/start?mode=${mode}`}
          className="mb-8 text-sm text-[#c6a96b] hover:underline"
        >
          ← Back
        </Link>

        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
          Harmonize Agreement
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Before we create the system.
        </h1>

        <p className="mt-6 text-base leading-7 text-[#d8d2c6]">
          Harmonize is designed for awareness, ownership, repair, integration,
          and practice together. It does not replace legal, medical, therapeutic,
          or emergency support.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="space-y-4">
            {agreements.map((agreement) => (
              <div
                key={agreement}
                className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-[#c6a96b]" />
                <p className="text-sm leading-6 text-[#d8d2c6]">
                  {agreement}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
          <h2 className="text-lg font-medium text-[#f4f1ea]">
            Safety note
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#bfb8aa]">
            If a shared message appears to contain contempt, personal data,
            private disclosures, or information that may be difficult to retract,
            Harmonize may pause the send and ask for review first.
          </p>
        </div>

        <Link
          href={`/harmonize/create?mode=${mode}`}
          className="mt-8 inline-flex w-fit rounded-full bg-[#c6a96b] px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
        >
          I understand — continue
        </Link>
      </section>
    </main>
  )
}