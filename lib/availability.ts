import { createClient } from '@/lib/supabase/server'
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

export async function getAvailableSlots(
  date: string,   // YYYY-MM-DD
  serviceId: string,
): Promise<TimeSlot[]> {
  const supabase = await createClient()

  // day_of_week: 0=Sun, 1=Mon, …, 6=Sat
  // Use noon UTC to avoid DST boundary issues when parsing date-only strings
  const dayOfWeek = new Date(date + 'T12:00:00Z').getUTCDay()

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

    supabase
      .from('bookings')
      .select('start_time, end_time')
      .eq('booking_date', date)
      .neq('status', 'cancelled'),
  ])

  // Date is closed (no weekly_availability) or explicitly blocked → no slots
  if (!availRes.data) return []
  if (blockedRes.data) return []

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

  for (let start = openMin; start <= closeMin; start += STRIDE) {
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

  return slots
}
