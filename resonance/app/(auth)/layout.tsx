// app/(auth)/layout.tsx
// Layout for auth pages: login, register, verify.
// Clean centred single-column layout. No nav, no sidebar.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#2D4A3E]">
            Resonance
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            A guided relational development journey
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
