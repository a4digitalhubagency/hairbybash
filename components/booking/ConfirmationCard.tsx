'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice, formatDate, formatTime, formatDuration, calculateDeposit } from '@/lib/format'
import type { Booking } from '@/types'

const MAX_RETRIES = 5
const RETRY_INTERVAL_MS = 3000

interface ConfirmationCardProps {
  booking: Booking | null
  sessionId: string
}

export default function ConfirmationCard({ booking: initialBooking, sessionId }: ConfirmationCardProps) {
  const [booking, setBooking] = useState(initialBooking)
  const [retries, setRetries] = useState(0)

  // Poll if booking is still pending (webhook may not have fired yet)
  useEffect(() => {
    if (booking?.status === 'confirmed') return
    if (retries >= MAX_RETRIES) return

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/booking-status?sessionId=${sessionId}`)
        if (res.ok) {
          const data = await res.json() as { booking: Booking | null }
          if (data.booking) setBooking(data.booking)
        }
      } catch {
        // Silently ignore — will retry
      }
      setRetries((r) => r + 1)
    }, RETRY_INTERVAL_MS)

    return () => clearTimeout(timer)
  }, [booking?.status, retries, sessionId])

  // ── No booking found at all ────────────────────────────────────────────────
  if (!booking) {
    return (
      <div className="max-w-lg mx-auto pt-16 text-center">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-medium">
          Booking Not Found
        </p>
        <h2 className="font-(family-name:--font-playfair) font-bold text-3xl text-white mb-4">
          We couldn&apos;t find your booking
        </h2>
        <p className="text-white/45 text-sm leading-relaxed mb-8">
          If you completed payment, your confirmation is on its way to your email.
          Please reach out if you have any questions.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="mailto:hello@hairbybash.ca"
            className="px-6 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
          >
            Contact Us
          </a>
          <Link
            href="/book"
            className="px-6 py-3 border border-white/30 text-white text-sm rounded hover:border-white/60 transition-colors"
          >
            Book Again
          </Link>
        </div>
      </div>
    )
  }

  const service = booking.service
  const isPending = booking.status !== 'confirmed'
  const deposit = service
    ? calculateDeposit(service.price, service.deposit_percentage)
    : null

  return (
    <div className="max-w-lg mx-auto">
      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center mb-8"
      >
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-gold mb-4 relative">
          {isPending ? (
            <span className="w-6 h-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </div>

        {isPending && retries >= MAX_RETRIES ? (
          <>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2 font-medium">
              Payment Received
            </p>
            <h2 className="font-(family-name:--font-playfair) font-bold text-3xl text-white mb-2">
              You&apos;re almost confirmed!
            </h2>
            <p className="text-white/45 text-sm">
              Your confirmation email is on its way. We&apos;ll see you soon.
            </p>
          </>
        ) : isPending ? (
          <>
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-2 font-medium">
              Confirming your booking…
            </p>
            <h2 className="font-(family-name:--font-playfair) font-bold text-3xl text-white mb-2">
              Processing payment
            </h2>
            <p className="text-white/45 text-sm">This usually takes just a moment.</p>
          </>
        ) : (
          <>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2 font-medium">
              Booking Confirmed
            </p>
            <h2 className="font-(family-name:--font-playfair) font-bold text-3xl text-white mb-2">
              See you soon!
            </h2>
            <p className="text-white/45 text-sm">
              A confirmation has been sent to{' '}
              <span className="text-white/70">{booking.client_email}</span>
            </p>
          </>
        )}
      </motion.div>

      {/* Details card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-dark-card border border-white/8 rounded-2xl overflow-hidden mb-6"
      >
        <div className="px-6 py-4 border-b border-white/8">
          <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
            Appointment Details
          </p>
        </div>

        <div className="px-6 divide-y divide-white/5">
          {service && (
            <Row label="Service" value={service.name} />
          )}
          <Row label="Date"    value={formatDate(booking.booking_date)} />
          <Row
            label="Time"
            value={`${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`}
          />
          {service && (
            <Row label="Duration" value={formatDuration(service.duration_minutes)} />
          )}
          {deposit && (
            <Row
              label="Deposit paid"
              value={formatPrice(deposit.depositTotal)}
              highlight
            />
          )}
          {deposit && (
            <Row
              label="Remaining at appointment"
              value={formatPrice(deposit.remainder)}
            />
          )}
        </div>
      </motion.div>

      {/* Location card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="bg-dark-card border border-white/8 rounded-2xl px-6 py-4 mb-8"
      >
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-white text-sm font-medium">Studio Location</p>
            <p className="text-white/40 text-xs mt-0.5">
              123 17th Ave SW, Calgary, AB T2T 0B8
            </p>
            <p className="text-white/30 text-xs mt-2">
              Full address details included in your confirmation email.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Link
          href="/"
          className="px-6 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/book"
          className="px-6 py-3 border border-white/30 text-white text-sm rounded hover:border-white/60 transition-colors"
        >
          Book Another Appointment
        </Link>
      </motion.div>
    </div>
  )
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-white/40 text-sm">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-gold' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}
