'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatTime } from '@/lib/format'
import type { Service, TimeSlot } from '@/types'

// Studio is open every day — no days are blocked client-side.
// The weekly_availability table is the source of truth server-side.
const CLOSED_DAYS = new Set<number>([])

interface StepDateTimeProps {
  service: Service
  selectedDate: string | null
  selectedSlot: TimeSlot | null
  availableSlots: TimeSlot[]
  slotsLoading: boolean
  onDateChange: (date: string) => void
  onSlotSelect: (slot: TimeSlot) => void
  onBack: () => void
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  // 0=Sun, 1=Mon … 6=Sat
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function StepDateTime({
  service,
  selectedDate,
  selectedSlot,
  availableSlots,
  slotsLoading,
  onDateChange,
  onSlotSelect,
  onBack,
}: StepDateTimeProps) {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  function prevMonth() {
    if (calMonth === 0) {
      setCalYear((y) => y - 1)
      setCalMonth(11)
    } else {
      setCalMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (calMonth === 11) {
      setCalYear((y) => y + 1)
      setCalMonth(0)
    } else {
      setCalMonth((m) => m + 1)
    }
  }

  function isDateDisabled(year: number, month: number, day: number): boolean {
    const dateStr = toDateStr(year, month, day)
    if (dateStr < todayStr) return true
    const dow = new Date(year, month, day).getDay()
    return CLOSED_DAYS.has(dow)
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)

  // Separate slots into morning (< 12:00) and afternoon (>= 12:00)
  const morningSlots = availableSlots.filter((s) => {
    const [h] = s.start.split(':').map(Number)
    return h < 12
  })
  const afternoonSlots = availableSlots.filter((s) => {
    const [h] = s.start.split(':').map(Number)
    return h >= 12
  })

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
        Back to services
      </button>

      <h2 className="font-(family-name:--font-playfair) font-bold text-2xl md:text-3xl text-white mb-1">
        Select Date &amp; Time
      </h2>
      <p className="text-white/40 text-sm mb-8">
        {service.name} · Studio open Mon–Sun
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ── Calendar ── */}
        <div className="md:w-72 shrink-0">
          <div className="bg-dark-card border border-white/8 rounded-2xl p-5">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/8 transition-all"
                aria-label="Previous month"
              >
                ‹
              </button>
              <span className="text-white font-medium text-sm">
                {MONTH_NAMES[calMonth]} {calYear}
              </span>
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/8 transition-all"
                aria-label="Next month"
              >
                ›
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_LABELS.map((d) => (
                <div key={d} className="text-center text-[10px] text-white/30 font-medium py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateStr = toDateStr(calYear, calMonth, day)
                const disabled = isDateDisabled(calYear, calMonth, day)
                const isSelected = selectedDate === dateStr
                const isToday = dateStr === todayStr

                return (
                  <button
                    key={day}
                    onClick={() => !disabled && onDateChange(dateStr)}
                    disabled={disabled}
                    className={`
                      relative h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs font-medium
                      transition-all duration-150
                      ${isSelected
                        ? 'bg-gold text-black font-semibold'
                        : disabled
                          ? 'text-white/15 cursor-not-allowed'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {day}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Time slots ── */}
        <div className="flex-1 min-w-0">
          {!selectedDate ? (
            <div className="h-full flex items-center justify-center py-16">
              <p className="text-white/25 text-sm italic">Select a date to see available times</p>
            </div>
          ) : slotsLoading ? (
            <div className="space-y-6">
              <div className="h-4 w-20 bg-white/8 rounded animate-pulse" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-white/8 rounded-xl animate-pulse" style={{ animationDelay: `${i * 0.07}s` }} />
                ))}
              </div>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/40 text-sm mb-1">No appointments available on this day.</p>
              <p className="text-white/25 text-xs">Please select another date.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {morningSlots.length > 0 && (
                <div>
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-3 font-medium">
                    Morning
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {morningSlots.map((slot) => (
                      <SlotButton
                        key={slot.start}
                        slot={slot}
                        isSelected={selectedSlot?.start === slot.start}
                        onSelect={onSlotSelect}
                      />
                    ))}
                  </div>
                </div>
              )}

              {afternoonSlots.length > 0 && (
                <div>
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-3 font-medium">
                    Afternoon
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {afternoonSlots.map((slot) => (
                      <SlotButton
                        key={slot.start}
                        slot={slot}
                        isSelected={selectedSlot?.start === slot.start}
                        onSelect={onSlotSelect}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function SlotButton({
  slot,
  isSelected,
  onSelect,
}: {
  slot: TimeSlot
  isSelected: boolean
  onSelect: (slot: TimeSlot) => void
}) {
  return (
    <button
      onClick={() => slot.available && onSelect(slot)}
      disabled={!slot.available}
      className={`
        px-3 py-2.5 rounded-xl text-xs font-medium text-center transition-all duration-150
        ${isSelected
          ? 'bg-gold text-black font-semibold'
          : slot.available
            ? 'bg-dark-card border border-white/10 text-white/70 hover:border-gold/40 hover:text-white'
            : 'bg-dark-card border border-white/5 text-white/20 cursor-not-allowed line-through'
        }
      `}
    >
      {formatTime(slot.start)}
    </button>
  )
}
