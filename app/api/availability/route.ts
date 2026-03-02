import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/availability'

export async function GET(req: NextRequest) {
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
  const today = new Date().toISOString().slice(0, 10)
  if (date < today) {
    return NextResponse.json({ slots: [] })
  }

  try {
    const slots = await getAvailableSlots(date, serviceId)
    return NextResponse.json(
      { slots },
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
