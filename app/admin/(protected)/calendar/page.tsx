import { createAdminClient } from '@/lib/supabase/admin'
import AdminCalendar from '@/components/admin/AdminCalendar'
import type { Booking } from '@/types'

/** Returns the Monday of the week containing `d`, as a YYYY-MM-DD string. */
function getMondayStr(d: Date): string {
  const date = new Date(d)
  const day  = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  return date.toISOString().slice(0, 10)
}

export default async function CalendarPage() {
  const weekStart = getMondayStr(new Date())
  const weekEnd   = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const weekEndStr = weekEnd.toISOString().slice(0, 10)

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
