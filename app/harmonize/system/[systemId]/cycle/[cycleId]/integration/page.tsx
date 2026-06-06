import Link from "next/link"

export default function HarmonizeIntegrationPage({
  params,
}: {
  params: { systemId: string; cycleId: string }
}) {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#f4f1ea]">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
        <Link
          href={`/harmonize/system/${params.systemId}/cycle/${params.cycleId}/ownership`}
          className="mb-8 text-sm text-[#c6a96b]"
        >
          ← Back to ownership
        </Link>

        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
          Integration
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          What becomes possible now?
        </h1>

        <p className="mt-6 text-base leading-7 text-[#d8d2c6]">
          Integration will be wired after the EL question library is connected.
        </p>
      </section>
    </main>
  )
}