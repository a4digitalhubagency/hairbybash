'use client'

import { formatPrice, formatDate, formatTime, formatDuration, calculateDeposit } from '@/lib/format'
import type { Service, TimeSlot } from '@/types'

interface StepReviewProps {
  service: Service
  selectedDate: string
  selectedSlot: TimeSlot
  clientName: string
  clientEmail: string
  clientPhone: string
  blowDryRequested: boolean
  checkoutLoading: boolean
  onConfirm: () => void
  onBack: () => void
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-white/40 text-sm shrink-0">{label}</span>
      <span className="text-white text-sm text-right">{value}</span>
    </div>
  )
}

export default function StepReview({
  service,
  selectedDate,
  selectedSlot,
  clientName,
  clientEmail,
  clientPhone,
  blowDryRequested,
  checkoutLoading,
  onConfirm,
  onBack,
}: StepReviewProps) {
  const deposit = calculateDeposit(service.price, service.deposit_percentage)

  return (
    <div>
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-white/40 hover:text-white/80 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to details
      </button>

      <h2 className="font-(family-name:--font-playfair) font-bold text-2xl md:text-3xl text-white mb-1">
        Review &amp; Confirm
      </h2>
      <p className="text-white/40 text-sm mb-8">
        Please verify your booking details before payment.
      </p>

      <div className="max-w-lg space-y-6">
        {/* Appointment details card */}
        <div className="bg-dark-card border border-white/8 rounded-2xl px-6 py-2">
          <p className="text-gold text-[10px] uppercase tracking-widest font-medium pt-4 pb-2">
            Appointment
          </p>
          <ReviewRow label="Service"  value={service.name} />
          <ReviewRow label="Category" value={service.category} />
          <ReviewRow label="Duration" value={formatDuration(service.duration_minutes)} />
          <ReviewRow label="Date"     value={formatDate(selectedDate)} />
          <ReviewRow
            label="Time"
            value={`${formatTime(selectedSlot.start)} – ${formatTime(selectedSlot.end)}`}
          />
          <ReviewRow
            label="Blow Dry Service"
            value={blowDryRequested
              ? 'Yes — fee charged in person on the day'
              : 'No — arriving detangled & blow dried'}
          />
        </div>

        {/* Client details card */}
        <div className="bg-dark-card border border-white/8 rounded-2xl px-6 py-2">
          <p className="text-gold text-[10px] uppercase tracking-widest font-medium pt-4 pb-2">
            Client
          </p>
          <ReviewRow label="Name"  value={clientName} />
          <ReviewRow label="Email" value={clientEmail} />
          <ReviewRow label="Phone" value={clientPhone} />
        </div>

        {/* Pricing card */}
        <div className="bg-dark-card border border-white/8 rounded-2xl px-6 py-5">
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">Service price</span>
              <span className="text-white/70 text-sm">{formatPrice(deposit.servicePrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">
                Deposit ({service.deposit_percentage}%)
              </span>
              <span className="text-white/70 text-sm">{formatPrice(deposit.depositBase)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">GST (5%)</span>
              <span className="text-white/70 text-sm">{formatPrice(deposit.depositGST)}</span>
            </div>

            <div className="border-t border-white/8 pt-3 flex justify-between items-center">
              <span className="text-white font-semibold text-sm">Deposit due today</span>
              <span className="text-gold font-bold text-xl">{formatPrice(deposit.depositTotal)}</span>
            </div>

            <p className="text-white/25 text-xs">
              Remaining {formatPrice(deposit.remainder)} is due at your appointment.
            </p>
          </div>
        </div>

        {/* Pay button (mobile + fallback for desktop) */}
        <button
          onClick={onConfirm}
          disabled={checkoutLoading}
          className="lg:hidden w-full flex items-center justify-center gap-2 py-4 bg-gold text-black font-semibold text-sm rounded-xl hover:bg-gold-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checkoutLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Redirecting to payment…
            </>
          ) : (
            `Pay ${formatPrice(deposit.depositTotal)} Deposit`
          )}
        </button>

        {/* Policy block */}
        <div className="bg-dark-card border border-white/8 rounded-2xl px-5 py-4 space-y-3">
          <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium">Booking Policies</p>

          <div className="space-y-2.5">
            <div className="flex gap-2.5">
              <span className="text-gold mt-0.5 shrink-0 text-xs">•</span>
              <p className="text-white/40 text-xs leading-relaxed">
                <span className="text-white/60 font-medium">Non-refundable deposit —</span>{' '}
                Your deposit is non-refundable under any circumstances.
              </p>
            </div>

            <div className="flex gap-2.5">
              <span className="text-gold mt-0.5 shrink-0 text-xs">•</span>
              <p className="text-white/40 text-xs leading-relaxed">
                <span className="text-white/60 font-medium">Late arrival —</span>{' '}
                A 1-hour buffer is built into each appointment. Arriving 30 or more minutes late forfeits
                your deposit and the full service price becomes due at booking.
              </p>
            </div>

            <div className="flex gap-2.5">
              <span className="text-gold mt-0.5 shrink-0 text-xs">•</span>
              <p className="text-white/40 text-xs leading-relaxed">
                <span className="text-white/60 font-medium">Rescheduling —</span>{' '}
                One reschedule is permitted provided it is requested more than 48 hours before your
                scheduled appointment. Contact us to arrange.
              </p>
            </div>
          </div>

          <p className="text-white/25 text-xs pt-1 leading-relaxed">
            By confirming you agree to the above policies. You will be redirected to Stripe for secure payment.
          </p>
        </div>
      </div>
    </div>
  )
}
