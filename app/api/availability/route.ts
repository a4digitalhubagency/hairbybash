import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/availability'
import { rateLimit, clientKey, tooManyRequests } from '@/lib/rate-limit'
import { studioDate } from '@/lib/date'

/**
 * Looser than checkout: the booking calendar fires one of these per date the
 * client clicks, so a browsing visitor legitimately makes a dozen in a minute.
 * This is a ceiling on scraping, not a throttle on use.
 */
const AVAILABILITY_LIMIT = 60
const AVAILABILITY_WINDOW_SECONDS = 60

export async function GET(req: NextRequest) {
  const { allowed, retryAfter } = await rateLimit(
    `availability:${clientKey(req)}`,
    AVAILABILITY_LIMIT,
    AVAILABILITY_WINDOW_SECONDS,
  )
  if (!allowed) return tooManyRequests(retryAfter)

  const { searchParams } = req.nextUrl
  const date = searchParams.get('date')
  const serviceId = searchParams.get('serviceId')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid or missing date — expected YYYY-MM-DD' },
      { status: 400 },
    )
  }

  if (!serviceId) {
    return NextResponse.json({ error: 'Missing serviceId' }, { status: 400 })
  }

  // Past dates: return empty silently (no 400 — the client calendar prevents this anyway)
  const today = studioDate()
  if (date < today) {
    return NextResponse.json({ slots: [] })
  }

  try {
    const { slots, noFit, insufficientTime } = await getAvailableSlots(date, serviceId)
    return NextResponse.json(
      { slots, noFit, insufficientTime },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    console.error('[availability] Error:', err)
    return NextResponse.json(
      { error: 'Failed to check availability. Please try again.' },
      { status: 500 },
    )
  }
}
