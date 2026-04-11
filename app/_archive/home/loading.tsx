export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <div className="h-8 w-40 bg-zinc-100 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="border rounded-2xl p-4 space-y-2"
            >
              <div className="h-4 w-48 bg-zinc-100 rounded animate-pulse" />
              <div className="h-3 w-16 bg-zinc-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}