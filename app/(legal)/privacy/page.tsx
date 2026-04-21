export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>

        <p className="text-zinc-400 text-sm">
          Last updated: April 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Overview</h2>
          <p className="text-zinc-300 leading-7">
            This Privacy Policy explains how Oremea collects, uses, and protects
            your personal information when you use our platform and services,
            including Resonance, The Current, and related experiences.
          </p>
          <p className="text-zinc-300 leading-7">
            By using Oremea, you agree to the practices described in this policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>

          <h3 className="text-lg font-medium">a. Account Information</h3>
          <p className="text-zinc-300 leading-7">
            When you sign up, we collect your email address and basic account
            details through our authentication provider (Clerk).
          </p>

          <h3 className="text-lg font-medium">b. User Content</h3>
          <p className="text-zinc-300 leading-7">
            We collect and store the responses, reflections, and inputs you
            provide within the platform. This includes content submitted during
            Pre-Wave, Journey, and Mirror interactions.
          </p>

          <h3 className="text-lg font-medium">c. Payment Information</h3>
          <p className="text-zinc-300 leading-7">
            Payments are processed through third-party providers such as Paystack.
            Oremea does not store your card or financial details.
          </p>

          <h3 className="text-lg font-medium">d. Usage Data</h3>
          <p className="text-zinc-300 leading-7">
            We may collect basic information about how you interact with the platform,
            including activity within the journey, to improve the experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
          <p className="text-zinc-300 leading-7">
            Your information is used to:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Provide and operate the platform</li>
            <li>Generate personalized insights through AI features (e.g., Mirror)</li>
            <li>Maintain and improve the experience</li>
            <li>Manage payments and access</li>
            <li>Communicate important updates</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. AI Processing</h2>
          <p className="text-zinc-300 leading-7">
            Some features use artificial intelligence to process your inputs and
            generate responses. This includes interpreting your reflections and
            returning synthesized insights.
          </p>
          <p className="text-zinc-300 leading-7">
            These outputs are generated automatically and are not reviewed manually.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Data Sharing</h2>
          <p className="text-zinc-300 leading-7">
            We do not sell your personal data.
          </p>
          <p className="text-zinc-300 leading-7">
            We may share data with trusted third-party services strictly for
            operating the platform, including:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Clerk (authentication)</li>
            <li>Paystack (payments)</li>
            <li>AI service providers (for generating insights)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Data Security</h2>
          <p className="text-zinc-300 leading-7">
            We take reasonable steps to protect your data. However, no system is
            completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Data Retention</h2>
          <p className="text-zinc-300 leading-7">
            We retain your data as long as your account is active or as needed
            to provide the Services. You may request deletion of your data at
            any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Your Rights</h2>
          <p className="text-zinc-300 leading-7">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Access your personal data</li>
            <li>Request correction or deletion</li>
            <li>Withdraw consent</li>
          </ul>
          <p className="text-zinc-300 leading-7">
            To exercise these rights, contact us at support@oremea.com.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. International Use</h2>
          <p className="text-zinc-300 leading-7">
            Oremea may be accessed globally. By using the platform, you consent
            to the processing of your data in accordance with this policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Changes to This Policy</h2>
          <p className="text-zinc-300 leading-7">
            This Privacy Policy may be updated from time to time. Continued use
            of the platform constitutes acceptance of any changes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">11. Contact</h2>
          <p className="text-zinc-300 leading-7">
            If you have questions about this policy, contact:
          </p>
          <p className="text-zinc-300">
            support@oremea.com
          </p>
        </section>
      </div>
    </main>
  );
}