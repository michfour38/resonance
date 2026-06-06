import Link from "next/link"

export default function HarmonizeInvitePage({
  params,
}: {
  params: { systemId: string }
}) {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#f4f1ea]">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
        <Link
          href={`/harmonize/system/${params.systemId}`}
          className="mb-8 text-sm text-[#c6a96b]"
        >
          ← Back to system
        </Link>

        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c6a96b]">
          Harmonize Invitations
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Invite participants.
        </h1>

        <p className="mt-6 text-base leading-7 text-[#d8d2c6]">
          Every participant requires their own account. Private reflections
          remain private. Shared repair is chosen, not extracted.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-medium">
            V1 Participant Invitations
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-6 text-[#bfb8aa]">
            <p>• Couple → invite 1 additional adult.</p>
            <p>• Family Adults → invite adult family members.</p>
            <p>• Team → invite team participants.</p>
            <p>• Parallel Parenting → invite the other parent.</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#c6a96b]/30 bg-[#c6a96b]/10 p-6">
          <h2 className="text-lg font-medium text-[#f4f1ea]">
            Minor participation disabled
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#d8d2c6]">
            Child participation remains hidden until legal, policy,
            verification, consent, privacy, and safeguarding research
            is completed.
          </p>
        </div>

        <button
          disabled
          className="mt-8 inline-flex w-fit rounded-full border border-white/10 px-6 py-3 text-sm opacity-50"
        >
          Invitation system coming next
        </button>
      </section>
    </main>
  )
}