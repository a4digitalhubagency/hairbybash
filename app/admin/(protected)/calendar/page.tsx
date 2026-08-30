import { createAdminClient } from '@/lib/supabase/admin'
import { studioNow, toDateString } from '@/lib/date'
import AdminCalendar from '@/components/admin/AdminCalendar'
import type { Booking } from '@/types'

/** Returns the Monday of the week containing `d`, as a YYYY-MM-DD string.
 *  `d` must carry Calgary wall-clock in its local fields — pass `studioNow()`. */
function getMondayStr(d: Date): string {
  const day  = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  return toDateString(monday)
}

export default async function CalendarPage() {
  const weekStart  = getMondayStr(studioNow())
  const weekEndDt  = new Date(weekStart + 'T00:00:00')
  weekEndDt.setDate(weekEndDt.getDate() + 6)
  const weekEndStr = toDateString(weekEndDt)

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
