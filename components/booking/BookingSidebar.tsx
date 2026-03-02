'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice, formatDateShort, formatTime, calculateDeposit } from '@/lib/format'
import type { Service, TimeSlot } from '@/types'
import type { BookingStep } from './StepIndicator'

interface BookingSidebarProps {
  service: Service | null
  selectedDate: string | null
  selectedSlot: TimeSlot | null
  currentStep: BookingStep
  onContinue: () => void
  isLoading: boolean
  canContinue: boolean
}

export default function BookingSidebar({
  service,
  selectedDate,
  selectedSlot,
  currentStep,
  onContinue,
  isLoading,
  canContinue,
}: BookingSidebarProps) {
  const deposit = service ? calculateDeposit(service.price, service.deposit_percentage) : null

  const ctaLabel: Record<BookingStep, string> = {
    service: 'Select a Service',
    datetime: 'Continue to Details',
    details: 'Review Booking',
    review: 'Pay Deposit to Confirm',
  }

  return (
    <div className="bg-dark-card border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/8">
        <h3 className="text-white font-semibold text-base">Booking Summary</h3>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Service */}
        <AnimatePresence mode="wait">
          {service ? (
            <motion.div
              key="service"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Service</p>
              <p className="text-white font-medium text-sm">{service.name}</p>
              <p className="text-gold text-xs mt-0.5">{service.category}</p>
            </motion.div>
          ) : (
            <motion.div
              key="no-service"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-10 flex items-center"
            >
              <p className="text-white/25 text-sm italic">No service selected</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date & Time */}
        <AnimatePresence>
          {(selectedDate || selectedSlot) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {selectedDate && (
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-white/70 text-sm">{formatDateShort(selectedDate)}</span>
                </div>
              )}
              {selectedSlot && (
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-white/70 text-sm">
                    {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing breakdown */}
        <AnimatePresence>
          {deposit && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="border-t border-white/8 pt-5 space-y-2.5"
            >
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">Service</span>
                <span className="text-white/70 text-xs">{formatPrice(deposit.servicePrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">
                  Deposit ({service!.deposit_percentage}%)
                </span>
                <span className="text-white/70 text-xs">{formatPrice(deposit.depositBase)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">GST (5%)</span>
                <span className="text-white/70 text-xs">{formatPrice(deposit.depositGST)}</span>
              </div>

              <div className="border-t border-white/8 pt-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-gold text-xs font-semibold uppercase tracking-wider">
                    Deposit Due Now
                  </span>
                  <span className="text-gold font-bold text-base">
                    {formatPrice(deposit.depositTotal)}
                  </span>
                </div>
                <p className="text-white/25 text-[10px] mt-1.5">
                  Remainder {formatPrice(deposit.remainder)} due at appointment
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button (desktop) */}
        <button
          onClick={onContinue}
          disabled={!canContinue || isLoading}
          className="hidden lg:flex w-full items-center justify-center gap-2 py-3.5 bg-gold text-black font-semibold text-sm rounded-xl hover:bg-gold-hover transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              {ctaLabel[currentStep]}
              {canContinue && <span className="text-black/60">→</span>}
            </>
          )}
        </button>

        {/* Cancellation policy */}
        <div className="border-t border-white/8 pt-4">
          <p className="text-white/30 text-[10px] leading-relaxed">
            <span className="text-white/50 font-medium">Cancellation Policy:</span>{' '}
            Deposit is non-refundable within 48 hours of your appointment.
            Please contact us as soon as possible to reschedule.
          </p>
        </div>
      </div>
    </div>
  )
}
