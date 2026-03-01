// Skeleton shown via Suspense while services load from Supabase
export default function ServicesSkeleton() {
  return (
    <section className="bg-dark py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="h-10 w-44 rounded bg-white/8 animate-pulse mb-2" />
            <div className="h-4 w-60 rounded bg-white/5 animate-pulse" />
          </div>
        </div>

        {/* Category tab pills */}
        <div className="flex gap-2 mb-10">
          {[56, 72, 52, 68, 80].map((w, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-white/8 animate-pulse"
              style={{ width: w, animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        {/* Card skeletons */}
        <div className="flex gap-5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-65 md:w-75 lg:w-[320px] aspect-3/4 rounded-2xl bg-white/6 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
