export default function EnvTestPage() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "undefined";
  const masked =
    key === "undefined" ? key : `${key.slice(0, 12)}...${key.slice(-6)}`;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-700 p-6">
        <h1 className="text-2xl font-semibold">Env Test</h1>
        <p className="mt-4 text-sm text-zinc-300">
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        </p>
        <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-zinc-900 p-4 text-xs text-zinc-100">
          {masked}
        </pre>
      </div>
    </main>
  );
}