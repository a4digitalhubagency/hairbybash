'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ConfirmationError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[/book/confirmation] Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-medium">
          Something went wrong
        </p>
        <h2 className="font-(family-name:--font-playfair) font-bold text-4xl text-white leading-tight mb-4">
          We couldn&apos;t load your confirmation
        </h2>
        <p className="text-white/45 text-sm leading-relaxed mb-10">
          If you completed payment, your booking is safe and a confirmation email
          is on its way. Please contact us if you need immediate assistance.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="mailto:hello@hairbybash.ca"
            className="px-7 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
          >
            Contact Us
          </a>
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
