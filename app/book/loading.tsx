export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-dark pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        {/* Step indicator skeleton */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full bg-white/8 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
              {i < 3 && <div className="w-16 h-px bg-white/8" />}
            </div>
          ))}
        </div>

        {/* Content + sidebar grid */}
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* Main content skeleton */}
          <div className="flex-1 min-w-0">
            <div className="h-7 w-48 bg-white/8 rounded animate-pulse mb-2" />
            <div className="h-4 w-72 bg-white/5 rounded animate-pulse mb-8" />

            {/* Service card skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-dark-card border border-white/5 p-4 flex gap-4"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="w-20 h-20 rounded-xl bg-white/8 shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-3/4 bg-white/8 rounded animate-pulse" />
                    <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:w-85 shrink-0">
            <div className="bg-dark-card border border-white/8 rounded-2xl p-6 space-y-4">
              <div className="h-5 w-32 bg-white/8 rounded animate-pulse" />
              <div className="h-px bg-white/8" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-white/8 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-white/8 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-14 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-px bg-white/8" />
              <div className="h-12 w-full bg-white/8 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
