import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const updates: Record<string, unknown> = {}
  if (body.name !== undefined)               updates.name = body.name.trim()
  if (body.description !== undefined)        updates.description = body.description.trim()
  if (body.price !== undefined)              updates.price = Math.round(Number(body.price) * 100)
  if (body.deposit_percentage !== undefined) updates.deposit_percentage = Number(body.deposit_percentage)
  if (body.duration_minutes !== undefined)   updates.duration_minutes = Number(body.duration_minutes)
  if (body.category !== undefined)           updates.category = body.category
  if (body.image_url !== undefined)          updates.image_url = body.image_url?.trim() || null
  if (body.active !== undefined)             updates.active = body.active

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[services] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }

  return NextResponse.json({ service: data })
}

const BUCKET = 'service-images'
const SUPABASE_STORAGE_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const admin = createAdminClient()

  // Fetch the service first so we can clean up its storage image if needed
  const { data: service } = await admin
    .from('services')
    .select('image_url')
    .eq('id', id)
    .single()

  const { error } = await admin
    .from('services')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[services] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }

  // Best-effort: remove the image from Storage if it came from our bucket
  if (service?.image_url?.startsWith(SUPABASE_STORAGE_PREFIX)) {
    const storagePath = service.image_url.slice(SUPABASE_STORAGE_PREFIX.length)
    await admin.storage.from(BUCKET).remove([storagePath])
  }

  return new NextResponse(null, { status: 204 })
}
