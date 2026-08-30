import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rejectUnauthorisedCron } from '@/lib/cron'
import { sendBookingReminderEmail, type FullBooking } from '@/lib/email'
import { addDays, studioDate, studioMinutes } from '@/lib/date'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * How far ahead of "now" a run reaches into tomorrow. Roughly the cron
 * interval, but it does not have to match exactly — see the catch-up note on
 * the query below.
 */
const WINDOW_MINUTES = 60

function pad(minutes: number): string {
  const clamped = Math.max(0, Math.min(minutes, 24 * 60))
  const h = Math.floor(clamped / 60)
  return `${String(h).padStart(2, '0')}:${String(clamped % 60).padStart(2, '0')}:00`
}

/**
 * Sends the 24-hour reminder for appointments starting roughly a day from now.
 *
 * Everything here is Calgary wall-clock rather than absolute time. Converting a
 * stored booking (a date plus a naive local time) into an instant would need the
 * inverse timezone conversion, which is ambiguous across a DST boundary. Working
 * in wall-clock also matches what the client actually cares about: "tomorrow at
 * ten" stays tomorrow at ten through a clock change.
 */
export async function GET(req: Request) {
  const rejected = rejectUnauthorisedCron(req)
  if (rejected) return rejected

  const targetDate = addDays(studioDate(), 1)
  const upTo = studioMinutes() + WINDOW_MINUTES

  const supabase = createAdminClient()

  const { data: due, error } = await supabase
    .from('bookings')
    .select('*, service:services(*)')
    .eq('booking_date', targetDate)
    .eq('status', 'confirmed')
    .is('reminder_sent_at', null)
    // Deliberately no lower bound. GitHub delays scheduled runs and sometimes
    // skips them outright, so a fixed hourly slice would drop those reminders
    // permanently. Taking everything not yet reminded up to the window edge
    // means the next run catches whatever the last one missed — a client gets a
    // slightly late reminder instead of none.
    .lt('start_time', pad(upTo))

  if (error) {
    console.error('[cron/reminders] Query failed:', error)
    return NextResponse.json({ error: 'Failed to load bookings' }, { status: 500 })
  }

  const results = { considered: due?.length ?? 0, sent: 0, skipped: 0, failed: 0 }

  for (const booking of due ?? []) {
    // Claim the row before sending. If a second run overlaps this one, its
    // update matches no rows and it will not send a duplicate. Claiming first
    // means a send failure costs a missed reminder rather than a repeated one —
    // the safer direction for an email a client receives.
    const { data: claimed, error: claimError } = await supabase
      .from('bookings')
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq('id', booking.id)
      .is('reminder_sent_at', null)
      .select('id')

    if (claimError) {
      console.error('[cron/reminders] Claim failed:', booking.id, claimError)
      results.failed++
      continue
    }
    if (!claimed || claimed.length === 0) {
      results.skipped++
      continue
    }

    try {
      await sendBookingReminderEmail(booking as FullBooking)
      results.sent++
    } catch (err) {
      console.error('[cron/reminders] Send failed:', booking.id, err)
      results.failed++
      // Release the claim so the next run can retry this one.
      await supabase
        .from('bookings')
        .update({ reminder_sent_at: null })
        .eq('id', booking.id)
    }
  }

  console.log(
    `[cron/reminders] ${targetDate} up to ${pad(upTo)} — ` +
    `considered ${results.considered}, sent ${results.sent}, skipped ${results.skipped}, failed ${results.failed}`,
  )

  return NextResponse.json({ date: targetDate, upTo: pad(upTo), ...results })
}
