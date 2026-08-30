import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('blocked_dates')
    .delete()
    .eq('id', id)
    .select('id')

  if (error) {
    console.error('[admin/blocked-dates/[id]] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete blocked date' }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Blocked date not found' }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
