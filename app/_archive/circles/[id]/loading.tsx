export default function CircleLoading() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">

        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-32 bg-zinc-100 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-zinc-100 rounded animate-pulse" />
        </div>

        {/* Composer skeleton */}
        <div className="space-y-3">
          <div className="h-24 w-full bg-zinc-100 rounded-xl animate-pulse" />
          <div className="h-9 w-16 bg-zinc-100 rounded-xl animate-pulse" />
        </div>

        {/* Post card skeletons */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-2xl p-4 space-y-2">
              <div className="h-3 w-40 bg-zinc-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-zinc-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-zinc-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}