import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { TimeSlot } from '@/types'

function timeToMinutes(t: string): number {
  // Accepts "HH:MM:SS" or "HH:MM"
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60).toString().padStart(2, '0')
  const min = (m % 60).toString().padStart(2, '0')
  return `${h}:${min}`
}

export interface AvailabilityResult {
  slots: TimeSlot[]
  /** True when the day is open but the service is too long to fit even once within open hours. */
  noFit: boolean
  /** True when free time exists between bookings but no single gap is long enough for the service. */
  insufficientTime: boolean
}

export async function getAvailableSlots(
  date: string,   // YYYY-MM-DD
  serviceId: string,
): Promise<AvailabilityResult> {
  const supabase = await createClient()

  // day_of_week: 0=Sun, 1=Mon, …, 6=Sat
  // Use noon UTC to avoid DST boundary issues when parsing date-only strings
  const dayOfWeek = new Date(date + 'T12:00:00Z').getUTCDay()

  const admin = createAdminClient()

  // Parallel fetch: all queries are independent
  const [availRes, blockedRes, serviceRes, bookingsRes] = await Promise.all([
    supabase
      .from('weekly_availability')
      .select('start_time, end_time')
      .eq('day_of_week', dayOfWeek)
      .maybeSingle(),

    supabase
      .from('blocked_dates')
      .select('id')
      .eq('date', date)
      .maybeSingle(),

    supabase
      .from('services')
      .select('duration_minutes')
      .eq('id', serviceId)
      .eq('active', true)
      .single(),

    // Admin client bypasses RLS — needed to see all bookings, not just the current user's
    admin
      .from('bookings')
      .select('start_time, end_time')
      .eq('booking_date', date)
      .neq('status', 'cancelled'),
  ])

  // Date is closed (no weekly_availability) or explicitly blocked → no slots
  if (!availRes.data) return { slots: [], noFit: false, insufficientTime: false }
  if (blockedRes.data) return { slots: [], noFit: false, insufficientTime: false }

  if (serviceRes.error || !serviceRes.data) {
    throw new Error('Service not found')
  }

  const openMin = timeToMinutes(availRes.data.start_time)
  const closeMin = timeToMinutes(availRes.data.end_time)
  const duration = serviceRes.data.duration_minutes

  // Slots are offered every 60 minutes regardless of service duration.
  // Duration determines the end time and conflict window — not the step
  // between selectable start times.
  const STRIDE = 60

  // Build occupied ranges from existing bookings
  const occupied: Array<{ start: number; end: number }> = (bookingsRes.data ?? []).map((b) => ({
    start: timeToMinutes(b.start_time),
    end: timeToMinutes(b.end_time),
  }))

  // Current time in minutes (for filtering past slots on today's date)
  const today = new Date().toISOString().slice(0, 10)
  const nowMinutes = date === today
    ? new Date().getHours() * 60 + new Date().getMinutes()
    : -1

  const slots: TimeSlot[] = []

  for (let start = openMin; start + duration <= closeMin; start += STRIDE) {
    const end = start + duration

    // Skip slots that have already passed today
    if (nowMinutes >= 0 && end <= nowMinutes) continue

    // Slot is unavailable if it overlaps any existing booking
    const isBooked = occupied.some(
      (occ) => start < occ.end && end > occ.start,
    )

    slots.push({
      start: minutesToTime(start),
      end: minutesToTime(end),
      available: !isBooked,
    })
  }

  // Compute free time windows (gaps between bookings within open hours).
  // Used to distinguish "fully booked" from "free time exists but too short for this service".
  const sortedOccupied = [...occupied].sort((a, b) => a.start - b.start)
  let cursor = openMin
  let hasLargeEnoughGap = false
  for (const occ of sortedOccupied) {
    if (occ.start > cursor && occ.start - cursor >= duration) {
      hasLargeEnoughGap = true
      break
    }
    cursor = Math.max(cursor, occ.end)
  }
  // Check the gap after the last booking to close
  if (!hasLargeEnoughGap && closeMin - cursor >= duration) hasLargeEnoughGap = true

  // insufficientTime: bookings exist, free windows exist, but none fit the service
  const insufficientTime = occupied.length > 0 && !hasLargeEnoughGap && slots.length > 0 && slots.every((s) => !s.available)

  // noFit: the service duration simply cannot fit within the working day (ignoring bookings).
  // Using openMin + duration > closeMin rather than slots.length === 0 avoids a false positive
  // on today's date when all slots have already passed.
  const noFit = openMin + duration > closeMin

  return { slots, noFit, insufficientTime }
}
