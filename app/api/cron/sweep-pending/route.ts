import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rejectUnauthorisedCron } from '@/lib/cron'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Stripe checkout sessions expire 30 minutes after creation. Five minutes of
 * slack keeps this from racing the webhook that would have resolved the booking
 * properly.
 */
const STALE_AFTER_MINUTES = 35

/**
 * Releases slots held by abandoned checkouts.
 *
 * A pending booking blocks its slot until Stripe fires checkout.session.expired.
 * If that webhook is misconfigured, dropped, or the endpoint is down, nothing
 * else ever releases it and the slot is lost for good. This is the backstop.
 *
 * Uses created_at, a real timestamp, so no timezone reasoning is involved.
 */
export async function GET(req: Request) {
  const rejected = rejectUnauthorisedCron(req)
  if (rejected) return rejected

  const cutoff = new Date(Date.now() - STALE_AFTER_MINUTES * 60 * 1000).toISOString()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('status', 'pending')
    .lt('created_at', cutoff)
    .select('id, booking_date, start_time')

  if (error) {
    console.error('[cron/sweep-pending] Update failed:', error)
    return NextResponse.json({ error: 'Failed to sweep pending bookings' }, { status: 500 })
  }

  const released = data ?? []

  // No client email here: either Stripe already sent the expiry notice, or the
  // client abandoned checkout without ever paying. A "your slot was released"
  // message for a booking they never completed would only confuse.
  if (released.length > 0) {
    console.log(
      `[cron/sweep-pending] Released ${released.length} stale slot(s): ` +
      released.map((b) => `${b.booking_date} ${b.start_time}`).join(', '),
    )
  }

  return NextResponse.json({ cutoff, released: released.length })
}
