// Skeleton shown via Suspense while the service menu loads from Supabase.
// Mirrors the category grid so the section doesn't reflow when it resolves.
export default function ServicesSkeleton() {
  return (
    <section className="bg-dark py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="h-10 w-44 rounded bg-white/8 animate-pulse mb-2" />
            <div className="h-4 w-72 rounded bg-white/5 animate-pulse" />
          </div>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-dark-card p-6"
            >
              <div className="h-6 w-28 rounded bg-white/8 animate-pulse" />
              <div className="mt-3 h-3 w-full rounded bg-white/5 animate-pulse" />
              <div className="mt-1.5 h-3 w-4/5 rounded bg-white/5 animate-pulse" />
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
                  <div className="mt-1.5 h-4 w-20 rounded bg-white/8 animate-pulse" />
                </div>
                <div className="h-4 w-4 rounded bg-white/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
