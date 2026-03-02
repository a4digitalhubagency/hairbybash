export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-32 bg-white/8 rounded-lg" />
        <div className="h-4 w-48 bg-white/5 rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-dark-card rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-white/8 rounded" />
              <div className="w-5 h-5 bg-white/8 rounded" />
            </div>
            <div className="h-8 w-20 bg-white/10 rounded" />
            <div className="h-3 w-32 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Bookings table */}
      <div className="bg-dark-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <div className="h-5 w-44 bg-white/8 rounded" />
          <div className="h-4 w-28 bg-white/5 rounded" />
        </div>
        <div className="divide-y divide-white/5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/8 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 bg-white/8 rounded" />
                <div className="h-3 w-24 bg-white/5 rounded" />
              </div>
              <div className="h-3.5 w-24 bg-white/8 rounded" />
              <div className="h-3.5 w-16 bg-white/8 rounded" />
              <div className="h-5 w-16 bg-white/8 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Blocked dates */}
      <div className="bg-dark-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <div className="h-5 w-28 bg-white/8 rounded" />
        </div>
        <div className="px-6 py-4">
          <div className="h-9 w-full bg-white/5 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
