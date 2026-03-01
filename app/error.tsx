'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// Catches any unhandled error in the app that isn't caught by a nested error.tsx
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-medium">
          Unexpected Error
        </p>
        <h2 className="font-(family-name:--font-playfair) font-bold text-4xl text-white leading-tight mb-4">
          Something went wrong
        </h2>
        <p className="text-white/45 text-sm leading-relaxed mb-10">
          An unexpected error occurred. Please try again — if this keeps happening,
          contact us and we&apos;ll sort it out.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={reset}
            className="px-7 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-7 py-3 border border-white/30 text-white text-sm rounded hover:border-white/60 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
