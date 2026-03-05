'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Toast from '@/components/ui/Toast'
import type { ToastMessage } from '@/components/ui/Toast'
import type { Booking, BookingStatus } from '@/types'
import { formatPrice } from '@/lib/format'

// ── Grid constants ────────────────────────────────────────────────────────────

const HOUR_HEIGHT  = 64            // px per hour on the grid
const GRID_START   = 8             // 8 AM
const GRID_END     = 20            // 8 PM
const GRID_HOURS   = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i)
const DAY_LABELS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ── Date helpers ──────────────────────────────────────────────────────────────

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day  = date.getDay()
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day))
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(d: Date, n: number): Date {
  const date = new Date(d)
  date.setDate(date.getDate() + n)
  return date
}

function toDateStr(d: Date): string {
  // Use local date parts — toISOString() is UTC and will be off by a day
  // on positive UTC offsets, causing bookings to land in the wrong column.
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function fmtMonthYear(d: Date): string {
  return d.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })
}

function fmtDayHeader(d: Date): { label: string; num: number; isToday: boolean } {
  const dow = d.getDay()  // 0=Sun … 6=Sat
  return {
    label: DAY_LABELS[dow === 0 ? 6 : dow - 1],
    num: d.getDate(),
    isToday: toDateStr(d) === toDateStr(new Date()),
  }
}

function fmtHour(h: number): string {
  if (h === 12) return '12 PM'
  return h < 12 ? `${h} AM` : `${h - 12} PM`
}

function fmtTime(t: string): string {
  const [hStr, mStr] = t.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`
}

function fmtDateLong(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

// ── Time → pixel helpers ──────────────────────────────────────────────────────

function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function bookingTop(startTime: string): number {
  return Math.max(0, ((timeToMin(startTime) - GRID_START * 60) / 60) * HOUR_HEIGHT)
}

function bookingHeight(startTime: string, endTime: string): number {
  return Math.max(20, ((timeToMin(endTime) - timeToMin(startTime)) / 60) * HOUR_HEIGHT)
}

// ── Status helpers ────────────────────────────────────────────────────────────

function isInProgress(b: Booking, now: Date): boolean {
  if (b.status === 'cancelled') return false
  if (b.booking_date !== toDateStr(now)) return false
  const nowMin = now.getHours() * 60 + now.getMinutes()
  return nowMin >= timeToMin(b.start_time) && nowMin < timeToMin(b.end_time)
}

interface StatusMeta {
  label: string
  cardBg: string; cardBorder: string; textColor: string
  badgeBg: string; badgeText: string
  dot: string
}

function getStatusMeta(b: Booking, now: Date): StatusMeta {
  if (isInProgress(b, now)) return {
    label: 'In Progress',
    cardBg: 'bg-gold/15',  cardBorder: 'border-gold/35',  textColor: 'text-gold',
    badgeBg: 'bg-gold/20', badgeText: 'text-gold',
    dot: 'bg-gold',
  }
  switch (b.status) {
    case 'confirmed': return {
      label: 'Confirmed',
      cardBg: 'bg-emerald-500/12', cardBorder: 'border-emerald-500/25', textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15', badgeText: 'text-emerald-400',
      dot: 'bg-emerald-400',
    }
    case 'cancelled': return {
      label: 'Cancelled',
      cardBg: 'bg-red-500/10', cardBorder: 'border-red-500/20', textColor: 'text-red-400/60',
      badgeBg: 'bg-red-500/12', badgeText: 'text-red-400',
      dot: 'bg-red-400',
    }
    default: return {       // pending
      label: 'Requested',
      cardBg: 'bg-amber-500/10', cardBorder: 'border-amber-500/25', textColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/12', badgeText: 'text-amber-400',
      dot: 'bg-amber-400',
    }
  }
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name.trim().split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className={`rounded-full bg-white/8 border border-white/12 flex items-center justify-center shrink-0 font-semibold text-white/70 ${
      size === 'md' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-[11px]'
    }`}>
      {initials}
    </div>
  )
}

// ── Booking card (on the grid) ────────────────────────────────────────────────

function BookingCard({
  booking, onClick, now,
}: { booking: Booking; onClick: (b: Booking) => void; now: Date }) {
  const meta    = getStatusMeta(booking, now)
  const top     = bookingTop(booking.start_time)
  const height  = bookingHeight(booking.start_time, booking.end_time)
  const compact = height < 50

  return (
    <button
      onClick={() => onClick(booking)}
      style={{ top, height }}
      className={`absolute inset-x-0.5 rounded-lg border px-2 py-1 text-left overflow-hidden select-none
        transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50
        ${meta.cardBg} ${meta.cardBorder}`}
    >
      {compact ? (
        <p className={`text-[10px] font-semibold truncate leading-tight ${meta.textColor}`}>
          {booking.service?.name ?? 'Booking'} · {booking.client_name}
        </p>
      ) : (
        <>
          <p className={`text-[11px] font-semibold truncate leading-tight ${meta.textColor}`}>
            {booking.service?.name ?? 'Booking'}
          </p>
          <p className="text-white/50 text-[10px] truncate">{booking.client_name}</p>
          {height >= 72 && (
            <p className="text-white/30 text-[9px] mt-0.5">
              {fmtTime(booking.start_time)} – {fmtTime(booking.end_time)}
            </p>
          )}
        </>
      )}
    </button>
  )
}

// ── Booking detail panel (shown in sidebar) ───────────────────────────────────

function BookingDetail({
  booking, onClose, onConfirm, onCancel, updating, now,
}: {
  booking: Booking
  onClose: () => void
  onConfirm: (id: string) => void
  onCancel: (id: string) => void
  updating: boolean
  now: Date
}) {
  const meta = getStatusMeta(booking, now)

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${meta.cardBg} ${meta.cardBorder}`}>
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold mb-1.5 ${meta.badgeBg} ${meta.badgeText}`}>
            {meta.label}
          </span>
          <p className="text-white font-semibold text-sm truncate">{booking.service?.name ?? 'Service'}</p>
          <p className="text-white/40 text-xs">{fmtDateLong(booking.booking_date)}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-1 text-white/25 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Client */}
      <div className="flex items-center gap-2.5">
        <Avatar name={booking.client_name} size="md" />
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{booking.client_name}</p>
          <p className="text-white/40 text-xs">{booking.client_phone}</p>
        </div>
      </div>

      {/* Time + duration */}
      <div className="flex items-center gap-1.5 text-white/50 text-xs">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        </svg>
        {fmtTime(booking.start_time)} – {fmtTime(booking.end_time)}
        {booking.service && ` · ${booking.service.duration_minutes}min`}
      </div>

      {/* Price */}
      {booking.service && (
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" />
          </svg>
          {formatPrice(booking.service.price)}
          {booking.service.deposit_percentage > 0 && (
            <span className="text-white/30">
              · {booking.service.deposit_percentage}% deposit
            </span>
          )}
        </div>
      )}

      {/* Email */}
      <div className="flex items-center gap-1.5 text-white/50 text-xs truncate">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="truncate">{booking.client_email}</span>
      </div>

      {/* Actions */}
      {booking.status === 'pending' && (
        <div className="flex gap-2 pt-0.5">
          <button
            onClick={() => onConfirm(booking.id)}
            disabled={updating}
            className="flex-1 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40"
          >
            {updating ? '…' : 'Confirm'}
          </button>
          <button
            onClick={() => onCancel(booking.id)}
            disabled={updating}
            className="flex-1 py-1.5 bg-red-500/12 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40"
          >
            {updating ? '…' : 'Decline'}
          </button>
        </div>
      )}
      {booking.status === 'confirmed' && !isInProgress(booking, now) && (
        <button
          onClick={() => onCancel(booking.id)}
          disabled={updating}
          className="w-full py-1.5 bg-red-500/8 hover:bg-red-500/15 text-red-400/70 hover:text-red-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-40"
        >
          {updating ? 'Cancelling…' : 'Cancel Appointment'}
        </button>
      )}
    </div>
  )
}

// ── Sidebar appointment row ───────────────────────────────────────────────────

function SidebarItem({
  booking, selected, onClick, now,
}: { booking: Booking; selected: boolean; onClick: () => void; now: Date }) {
  const meta = getStatusMeta(booking, now)

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors
        ${selected ? 'bg-white/8 ring-1 ring-white/10' : 'hover:bg-white/5'}`}
    >
      <div className="w-13 shrink-0 text-right">
        <p className="text-white/45 text-[11px] font-medium leading-tight">{fmtTime(booking.start_time)}</p>
      </div>
      <Avatar name={booking.client_name} />
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">{booking.client_name}</p>
        <p className="text-white/35 text-[10px] truncate">{booking.service?.name}</p>
      </div>
      <span className={`shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}>
        {meta.label}
      </span>
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  initialBookings: Booking[]
  initialWeekStart: string   // YYYY-MM-DD (Monday)
}

export default function AdminCalendar({ initialBookings, initialWeekStart }: Props) {
  const [weekStart, setWeekStart] = useState(
    () => new Date(initialWeekStart + 'T00:00:00'),
  )
  const [view, setView]         = useState<'week' | 'day'>('week')
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [loading, setLoading]   = useState(false)
  const [selected, setSelected] = useState<Booking | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toasts, setToasts]     = useState<ToastMessage[]>([])
  const [now, setNow]           = useState(new Date())

  // Day-view date (defaults to today)
  const [dayViewDate, setDayViewDate] = useState(() => toDateStr(new Date()))

  // AbortController ref — cancels in-flight fetches on rapid week navigation
  const fetchAbortRef = useRef<AbortController | null>(null)

  // Live clock — update every minute for "in progress" detection
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, message, type }])
  }, [])

  // ── Fetch bookings for a given week ────────────────────────────────────────

  const fetchWeek = useCallback(async (start: Date) => {
    // Cancel any in-flight request (rapid prev/next clicks)
    fetchAbortRef.current?.abort()
    const controller = new AbortController()
    fetchAbortRef.current = controller

    setLoading(true)
    const end = addDays(start, 6)
    try {
      const res = await fetch(
        `/api/admin/bookings/calendar?start=${toDateStr(start)}&end=${toDateStr(end)}`,
        { signal: controller.signal },
      )
      if (res.status === 401) throw new Error('Session expired — please log in again')
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? 'Failed to load bookings')
      }
      const { bookings: data } = await res.json()
      setBookings(data)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return   // superseded by newer fetch
      addToast(err instanceof Error ? err.message : 'Failed to load bookings', 'error')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [addToast])

  // ── Navigation ─────────────────────────────────────────────────────────────

  function navigate(dir: -1 | 1) {
    const next = addDays(weekStart, dir * 7)
    setWeekStart(next)
    setSelected(null)
    fetchWeek(next)
  }

  function goToday() {
    const monday = getMonday(new Date())
    const todayDay = toDateStr(new Date())
    if (toDateStr(monday) !== toDateStr(weekStart)) {
      setWeekStart(monday)
      fetchWeek(monday)
    }
    setDayViewDate(todayDay)
    setSelected(null)
  }

  // ── Derived data ───────────────────────────────────────────────────────────

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  )

  const todayStr = toDateStr(new Date())

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {}
    for (const b of bookings) {
      if (b.status === 'cancelled') continue
      ;(map[b.booking_date] ??= []).push(b)
    }
    return map
  }, [bookings])

  // Derived directly from raw bookings so cancelled appointments appear in the sidebar
  const todayBookings = useMemo(
    () => bookings
      .filter(b => b.booking_date === todayStr)
      .slice()
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [bookings, todayStr],
  )

  const dayBookings = useMemo(
    () => (bookingsByDate[dayViewDate] ?? [])
      .slice()
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [bookingsByDate, dayViewDate],
  )

  // Current time indicator position
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const timeTop = (nowMin >= GRID_START * 60 && nowMin <= GRID_END * 60)
    ? ((nowMin - GRID_START * 60) / 60) * HOUR_HEIGHT
    : null

  const isCurrentWeek = toDateStr(getMonday(new Date())) === toDateStr(weekStart)

  const todayStats = {
    confirmed: todayBookings.filter(b => b.status === 'confirmed').length,
    pending:   todayBookings.filter(b => b.status === 'pending').length,
    cancelled: todayBookings.filter(b => b.status === 'cancelled').length,
  }

  // ── Status update ──────────────────────────────────────────────────────────

  async function handleStatusChange(id: string, status: BookingStatus) {
    const original = bookings.find(b => b.id === id)
    if (!original) return

    setUpdatingId(id)

    // Optimistic update
    const patch = (prev: Booking[]): Booking[] =>
      prev.map(b => b.id === id ? { ...b, status } : b)
    setBookings(patch)
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? 'Failed to update')
      }
      addToast(`Booking ${status}`, 'success')
    } catch (err) {
      // Revert
      const revert = (prev: Booking[]): Booking[] =>
        prev.map(b => b.id === id ? { ...original } : b)
      setBookings(revert)
      if (selected?.id === id) setSelected(original)
      addToast(err instanceof Error ? err.message : 'Failed to update booking', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Grid column ────────────────────────────────────────────────────────────

  function GridColumn({ date }: { date: Date }) {
    const dateStr   = toDateStr(date)
    const isToday   = dateStr === todayStr
    const dayBkgs   = (bookingsByDate[dateStr] ?? []).slice().sort(
      (a, b) => a.start_time.localeCompare(b.start_time),
    )

    return (
      <div
        className={`relative ${isToday ? 'bg-gold/3' : ''}`}
        style={{ height: (GRID_END - GRID_START) * HOUR_HEIGHT }}
      >
        {/* Hour lines */}
        {GRID_HOURS.map((_, i) => (
          <div key={i} className="absolute inset-x-0 border-t border-white/4" style={{ top: i * HOUR_HEIGHT }} />
        ))}

        {/* Half-hour lines */}
        {GRID_HOURS.map((_, i) => (
          <div key={`h${i}`} className="absolute inset-x-0 border-t border-white/2" style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />
        ))}

        {/* Current time line (today only) */}
        {isToday && timeTop !== null && (
          <div className="absolute inset-x-0 z-10 flex items-center pointer-events-none" style={{ top: timeTop }}>
            <div className="w-2 h-2 rounded-full bg-gold shrink-0 -ml-1 shadow-[0_0_6px_var(--color-yellow-400)]" />
            <div className="flex-1 h-px bg-gold/70" />
          </div>
        )}

        {/* Booking cards */}
        {dayBkgs.map(b => (
          <BookingCard
            key={b.id}
            booking={b}
            onClick={b => setSelected(prev => prev?.id === b.id ? null : b)}
            now={now}
          />
        ))}
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Toast toasts={toasts} onDismiss={id => setToasts(p => p.filter(t => t.id !== id))} />

      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Calendar panel ──────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/8 shrink-0 flex-wrap gap-y-2">
            {/* Month / week nav */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigate(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-white font-semibold text-sm w-40 text-center select-none">
                {fmtMonthYear(weekStart)}
              </h2>
              <button
                onClick={() => navigate(1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {!isCurrentWeek && (
              <button
                onClick={goToday}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-medium rounded-lg transition-colors"
              >
                Today
              </button>
            )}

            {/* Week / Day toggle */}
            <div className="ml-auto flex items-center bg-white/5 border border-white/8 rounded-lg p-0.5">
              {(['week', 'day'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => {
                    setView(v)
                    if (v === 'day') setDayViewDate(todayStr)
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    view === v
                      ? 'bg-dark-card text-white shadow'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Loading bar */}
          <div className={`h-0.5 shrink-0 transition-opacity ${loading ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-full bg-gold/50 w-full animate-pulse" />
          </div>

          {/* Scrollable grid area */}
          <div className="flex-1 overflow-auto">

            {/* ── WEEK VIEW ─────────────────────────────────────────────── */}
            {view === 'week' && (
              <div className="flex flex-col" style={{ minWidth: 560 }}>

                {/* Day header row */}
                <div className="flex sticky top-0 z-20 bg-dark-surface border-b border-white/8">
                  <div className="w-14 shrink-0" /> {/* gutter */}
                  {weekDays.map((d, i) => {
                    const { label, num, isToday } = fmtDayHeader(d)
                    const dateStr = toDateStr(d)
                    const dots = (bookingsByDate[dateStr] ?? []).slice(0, 4)

                    return (
                      <div
                        key={i}
                        className={`flex-1 py-2.5 text-center border-r border-white/5 ${isToday ? 'bg-gold/5' : ''}`}
                      >
                        <p className="text-white/30 text-[9px] uppercase tracking-[0.15em]">{label}</p>
                        <div className={`inline-flex w-7 h-7 mt-0.5 items-center justify-center rounded-full text-sm font-semibold ${
                          isToday ? 'bg-gold text-black' : 'text-white/60'
                        }`}>
                          {num}
                        </div>
                        {/* Status dots */}
                        {dots.length > 0 && (
                          <div className="flex justify-center gap-0.5 mt-0.5">
                            {dots.map(b => (
                              <div key={b.id} className={`w-1 h-1 rounded-full ${getStatusMeta(b, now).dot}`} />
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Time grid */}
                <div className="flex">
                  {/* Hour labels */}
                  <div className="w-14 shrink-0 relative select-none" style={{ height: (GRID_END - GRID_START) * HOUR_HEIGHT }}>
                    {GRID_HOURS.map((h, i) => (
                      <div
                        key={h}
                        className="absolute right-2 text-white/20 text-[10px] -translate-y-2"
                        style={{ top: i * HOUR_HEIGHT }}
                      >
                        {fmtHour(h)}
                      </div>
                    ))}
                  </div>

                  {/* Columns */}
                  <div className="grid flex-1 border-l border-white/5" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {weekDays.map((d, i) => (
                      <div key={i} className="border-r border-white/5 last:border-r-0">
                        <GridColumn date={d} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── DAY VIEW ──────────────────────────────────────────────── */}
            {view === 'day' && (
              <div className="flex flex-col">
                {/* Day nav */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 sticky top-0 z-20 bg-dark-surface">
                  <button
                    onClick={() => setDayViewDate(toDateStr(addDays(new Date(dayViewDate + 'T12:00:00'), -1)))}
                    className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <p className="flex-1 text-center text-white/70 text-sm font-medium select-none">
                    {fmtDateLong(dayViewDate)}
                  </p>
                  <button
                    onClick={() => setDayViewDate(toDateStr(addDays(new Date(dayViewDate + 'T12:00:00'), 1)))}
                    className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Single day grid */}
                <div className="flex">
                  <div className="w-14 shrink-0 relative select-none" style={{ height: (GRID_END - GRID_START) * HOUR_HEIGHT }}>
                    {GRID_HOURS.map((h, i) => (
                      <div key={h} className="absolute right-2 text-white/20 text-[10px] -translate-y-2" style={{ top: i * HOUR_HEIGHT }}>
                        {fmtHour(h)}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 border-l border-white/8 min-w-65">
                    <GridColumn date={new Date(dayViewDate + 'T12:00:00')} />
                  </div>
                </div>

                {/* Day empty state */}
                {dayBookings.length === 0 && (
                  <div className="absolute inset-x-14 top-32 flex flex-col items-center justify-center py-16 pointer-events-none">
                    <p className="text-white/15 text-sm">No appointments</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Today's Schedule sidebar ──────────────────────────────────────── */}
        <div className="hidden lg:flex w-72 shrink-0 border-l border-white/8 flex-col">

          {/* Header */}
          <div className="px-5 py-4 border-b border-white/8 shrink-0">
            <p className="text-gold text-[10px] tracking-[0.2em] uppercase font-semibold">
              Today&apos;s Schedule
            </p>
            <p className="text-white/45 text-xs mt-0.5">
              {new Date().toLocaleDateString('en-CA', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 border-b border-white/8 shrink-0" style={{ gap: 1, background: 'rgba(255,255,255,0.05)' }}>
            {[
              { label: 'Confirmed', value: todayStats.confirmed, textCls: 'text-emerald-400' },
              { label: 'Pending',  value: todayStats.pending,   textCls: 'text-amber-400' },
              { label: 'Cancelled', value: todayStats.cancelled, textCls: 'text-red-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-dark-surface px-3 py-3 text-center">
                <p className={`text-xl font-bold ${stat.textCls}`}>{stat.value}</p>
                <p className="text-white/25 text-[9px] uppercase tracking-wider font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Selected booking detail */}
          {selected && (
            <div className="px-4 pt-3 pb-0 shrink-0 border-b border-white/8">
              <BookingDetail
                booking={selected}
                onClose={() => setSelected(null)}
                onConfirm={id => handleStatusChange(id, 'confirmed')}
                onCancel={id => handleStatusChange(id, 'cancelled')}
                updating={updatingId === selected.id}
                now={now}
              />
              <div className="h-3" />
            </div>
          )}

          {/* Today's appointment list */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
            {todayBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-1.5">
                <svg className="w-8 h-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
                <p className="text-white/20 text-sm text-center">No appointments today</p>
              </div>
            ) : (
              todayBookings.map(b => (
                <SidebarItem
                  key={b.id}
                  booking={b}
                  selected={selected?.id === b.id}
                  onClick={() => setSelected(prev => prev?.id === b.id ? null : b)}
                  now={now}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/8 shrink-0">
            <button
              onClick={() => { setView('week'); goToday() }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl text-white/45 hover:text-white text-xs font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              View Full Week
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
