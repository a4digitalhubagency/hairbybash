import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 10

export async function GET(req: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const filter = searchParams.get('filter') ?? 'upcoming'  // upcoming | all

  const admin = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)

  let query = admin
    .from('bookings')
    .select('*, service:services(*)', { count: 'exact' })
    .order('booking_date', { ascending: true })
    .order('start_time', { ascending: true })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (filter === 'upcoming') {
    query = query
      .gte('booking_date', today)
      .neq('status', 'cancelled')
  }

  const { data, error, count } = await query

  if (error) {
    console.error('[admin/bookings] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }

  return NextResponse.json({ bookings: data ?? [], total: count ?? 0, page, pageSize: PAGE_SIZE })
}
