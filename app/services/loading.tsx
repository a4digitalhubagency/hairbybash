// Shown automatically by Next.js while app/services/page.tsx fetches data
export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-dark">

      {/* Hero skeleton */}
      <div className="bg-dark-surface pt-36 pb-20 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-3 w-28 rounded-full bg-white/8 animate-pulse mx-auto" />
          <div className="h-14 w-80 rounded bg-white/8 animate-pulse mx-auto" />
          <div className="h-4 w-96 rounded bg-white/5 animate-pulse mx-auto" />
          <div className="h-4 w-72 rounded bg-white/5 animate-pulse mx-auto" />
        </div>
      </div>

      {/* Filter tab skeletons */}
      <div className="bg-dark pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-2 mb-12">
            {[88, 68, 52, 60, 76, 52].map((w, i) => (
              <div
                key={i}
                className="h-9 rounded-full bg-white/8 animate-pulse"
                style={{ width: w, animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>

          {/* Card grid skeletons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-dark-card rounded-2xl overflow-hidden border border-white/5 animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="aspect-square bg-white/8" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between gap-2">
                    <div className="h-4 w-28 rounded bg-white/8" />
                    <div className="h-4 w-10 rounded bg-white/8" />
                  </div>
                  <div className="h-3 w-full rounded bg-white/5" />
                  <div className="h-3 w-4/5 rounded bg-white/5" />
                  <div className="h-9 w-full rounded-lg bg-white/5 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
