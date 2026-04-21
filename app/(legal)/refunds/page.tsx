export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-semibold">Refund Policy</h1>

        <p className="text-zinc-400 text-sm">
          Last updated: April 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Overview</h2>
          <p className="text-zinc-300 leading-7">
            This Refund Policy outlines the terms under which payments made to
            Oremea may be refunded. By purchasing access to any Oremea services,
            including Resonance, Mirror, or The Current, you agree to this policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Digital Product Nature</h2>
          <p className="text-zinc-300 leading-7">
            Oremea provides access to digital experiences, including guided
            journeys, reflections, and AI-generated insights. These services are
            considered digital goods and are delivered immediately upon purchase
            or activation.
          </p>
          <p className="text-zinc-300 leading-7">
            Due to the nature of digital access, all purchases are generally
            non-refundable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. General Refund Policy</h2>
          <p className="text-zinc-300 leading-7">
            All payments made to Oremea are final and non-refundable, except under
            specific circumstances outlined below or at the sole discretion of
            Oremea.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Exceptions</h2>
          <p className="text-zinc-300 leading-7">
            Refunds may be considered in limited situations, including:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Duplicate payments</li>
            <li>Technical failures preventing access to purchased services</li>
            <li>Billing errors</li>
          </ul>
          <p className="text-zinc-300 leading-7">
            Any refund request must be submitted within a reasonable timeframe
            after the issue occurs.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Non-Refundable Situations</h2>
          <p className="text-zinc-300 leading-7">
            Refunds will not be provided for:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Change of mind after purchase</li>
            <li>Partial use of the service</li>
            <li>Perceived lack of results or outcomes</li>
            <li>Failure to engage with the experience</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Payment Processing</h2>
          <p className="text-zinc-300 leading-7">
            Payments are processed through third-party providers such as Paystack.
            Oremea does not store or manage your payment details directly.
          </p>
          <p className="text-zinc-300 leading-7">
            Refunds, when approved, will be processed through the original payment
            method where possible.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Subscription or Future Services</h2>
          <p className="text-zinc-300 leading-7">
            If Oremea introduces subscription-based services in the future, separate
            cancellation and refund terms may apply and will be clearly communicated
            at the time of purchase.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Contact</h2>
          <p className="text-zinc-300 leading-7">
            To request a refund or report a billing issue, contact:
          </p>
          <p className="text-zinc-300">
            support@oremea.com
          </p>
        </section>
      </div>
    </main>
  );
}