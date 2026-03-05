import { createAdminClient } from '@/lib/supabase/admin'
import AdminCalendar from '@/components/admin/AdminCalendar'
import type { Booking } from '@/types'

/** Returns the Monday of the week containing `d`, as a YYYY-MM-DD string.
 *  Uses UTC-only arithmetic so the result is timezone-invariant on any server. */
function getMondayStr(d: Date): string {
  const day  = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setUTCDate(d.getUTCDate() + diff)
  monday.setUTCHours(0, 0, 0, 0)
  return monday.toISOString().slice(0, 10)
}

export default async function CalendarPage() {
  const weekStart  = getMondayStr(new Date())
  const weekEndDt  = new Date(weekStart + 'T00:00:00Z')
  weekEndDt.setUTCDate(weekEndDt.getUTCDate() + 6)
  const weekEndStr = weekEndDt.toISOString().slice(0, 10)

  const admin = createAdminClient()
  const { data } = await admin
    .from('bookings')
    .select('*, service:services(*)')
    .gte('booking_date', weekStart)
    .lte('booking_date', weekEndStr)
    .order('booking_date', { ascending: true })
    .order('start_time',   { ascending: true })

  const bookings = (data ?? []) as Booking[]

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <AdminCalendar initialBookings={bookings} initialWeekStart={weekStart} />
    </div>
  )
}
