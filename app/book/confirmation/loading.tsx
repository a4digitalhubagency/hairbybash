export default function ConfirmationLoading() {
  return (
    <div className="min-h-screen bg-dark pt-20 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        {/* Icon + heading skeleton */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 rounded-full bg-white/8 animate-pulse mb-4" />
          <div className="h-3 w-24 bg-white/8 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-8 w-64 bg-white/8 rounded mx-auto mb-2 animate-pulse" />
          <div className="h-4 w-72 bg-white/5 rounded mx-auto animate-pulse" />
        </div>

        {/* Details card skeleton */}
        <div className="bg-dark-card border border-white/8 rounded-2xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-white/8">
            <div className="h-3 w-36 bg-white/8 rounded animate-pulse" />
          </div>
          <div className="px-6 divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between py-3">
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-32 bg-white/8 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA skeleton */}
        <div className="flex justify-center gap-3">
          <div className="h-10 w-32 bg-white/8 rounded animate-pulse" />
          <div className="h-10 w-48 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
