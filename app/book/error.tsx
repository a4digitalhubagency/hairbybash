'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function BookError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[/book] Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-medium">
          Something went wrong
        </p>
        <h2 className="font-(family-name:--font-playfair) font-bold text-4xl text-white leading-tight mb-4">
          We couldn&apos;t load the booking page
        </h2>
        <p className="text-white/45 text-sm leading-relaxed mb-10">
          There was a problem connecting to our system. This is usually temporary —
          please try again or contact us directly to book.
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
