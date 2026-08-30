import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { searchParams } = req.nextUrl
  const start = searchParams.get('start')
  const end   = searchParams.get('end')

  if (!start || !end || !/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    return NextResponse.json(
      { error: 'start and end query params are required (YYYY-MM-DD)' },
      { status: 400 },
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('bookings')
    .select('*, service:services(*)')
    .gte('booking_date', start)
    .lte('booking_date', end)
    .order('booking_date', { ascending: true })
    .order('start_time',   { ascending: true })

  if (error) {
    console.error('[bookings/calendar] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }

  return NextResponse.json({ bookings: data ?? [] })
}
