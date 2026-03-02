import { NextRequest, NextResponse } from 'next/server'
import { getBookingBySessionId } from '@/lib/bookings'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
  }

  try {
    const booking = await getBookingBySessionId(sessionId)
    return NextResponse.json(
      { booking },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    console.error('[booking-status] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch booking status' }, { status: 500 })
  }
}
