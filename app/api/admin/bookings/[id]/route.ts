import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendStatusUpdateEmail, type FullBooking } from '@/lib/email'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { status } = body

  if (!['confirmed', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const admin = createAdminClient()

  // .neq guard: if the booking is already in the requested status (e.g. double-click),
  // skip the update so we don't send a duplicate notification email.
  const { data, error } = await admin
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .neq('status', status)
    .select('id, status')
    .maybeSingle()

  if (error) {
    console.error('[admin/bookings/[id]] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }

  // No rows updated — booking was already in the requested status
  if (!data) {
    return NextResponse.json({ booking: { id, status } })
  }

  // Status changed — notify the client
  try {
    const { data: fullBooking } = await admin
      .from('bookings')
      .select('*, service:services(*)')
      .eq('id', id)
      .single()
    if (fullBooking) await sendStatusUpdateEmail(fullBooking as FullBooking, status)
  } catch (emailErr) {
    console.error('[admin/bookings/[id]] Email send failed (non-fatal):', emailErr)
  }

  return NextResponse.json({ booking: data })
}
