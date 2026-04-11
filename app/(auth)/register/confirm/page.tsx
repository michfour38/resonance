// app/(auth)/register/confirm/page.tsx
// Shown after registration email is sent.

export default function RegisterConfirmPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
      <div className="text-3xl mb-3">✉️</div>
      <h2 className="text-lg font-medium text-stone-800 mb-2">Check your email</h2>
      <p className="text-sm text-stone-500 leading-relaxed">
        We sent a confirmation link to your email address.
        Click the link to activate your account and begin onboarding.
      </p>
      <p className="text-xs text-stone-400 mt-4">
        Didn't receive it? Check your spam folder, or try registering again.
      </p>
    </div>
  );
}
