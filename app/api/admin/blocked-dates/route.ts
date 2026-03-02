import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  // ── Auth check ────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('blocked_dates')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('[admin/blocked-dates] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch blocked dates' }, { status: 500 })
  }

  return NextResponse.json({ blockedDates: data ?? [] })
}

export async function POST(req: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { date, reason } = body

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Valid date (YYYY-MM-DD) is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('blocked_dates')
    .insert({ date, reason: reason ?? null })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'This date is already blocked' }, { status: 409 })
    }
    console.error('[admin/blocked-dates] POST error:', error)
    return NextResponse.json({ error: 'Failed to block date' }, { status: 500 })
  }

  return NextResponse.json({ blockedDate: data }, { status: 201 })
}
