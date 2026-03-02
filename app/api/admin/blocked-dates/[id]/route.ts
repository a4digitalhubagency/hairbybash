import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const admin = createAdminClient()
  const { error } = await admin
    .from('blocked_dates')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[admin/blocked-dates/[id]] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete blocked date' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
