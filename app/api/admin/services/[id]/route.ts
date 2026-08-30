import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { studioDate } from '@/lib/date'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const body = await req.json()

  const updates: Record<string, unknown> = {}
  if (body.name !== undefined)               updates.name = body.name.trim()
  if (body.description !== undefined)        updates.description = body.description.trim()
  if (body.price !== undefined)              updates.price = Math.round(Number(body.price) * 100)
  if (body.deposit_percentage !== undefined) updates.deposit_percentage = Number(body.deposit_percentage)
  if (body.duration_minutes !== undefined)   updates.duration_minutes = Number(body.duration_minutes)
  if (body.category_id !== undefined)        updates.category_id = body.category_id
  if (body.image_url !== undefined)          updates.image_url = body.image_url?.trim() || null
  if (body.active !== undefined)             updates.active = body.active

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Keep the deprecated `category` text column in step with category_id.
  if (updates.category_id) {
    const { data: category } = await admin
      .from('categories')
      .select('name')
      .eq('id', updates.category_id as string)
      .maybeSingle()
    if (!category) {
      return NextResponse.json({ error: 'That category no longer exists' }, { status: 400 })
    }
    updates.category = category.name
  }

  const { data, error } = await admin
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Another service in that category already has this name.' },
        { status: 409 },
      )
    }
    console.error('[services] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }

  return NextResponse.json({ service: data })
}

const BUCKET = 'service-images'
const SUPABASE_STORAGE_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const force = req.nextUrl.searchParams.get('force') === 'true'
  const admin = createAdminClient()

  // Two separate questions, and conflating them is what made this route
  // return an unexplained 500.
  //
  // First: are there upcoming bookings a client is still expecting? That is a
  // business objection, and ?force=true overrides it.
  if (!force) {
    const today = studioDate()
    const { count } = await admin
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('service_id', id)
      .gte('booking_date', today)
      .in('status', ['pending', 'confirmed'])

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: 'Service has upcoming bookings', bookingCount: count },
        { status: 409 },
      )
    }
  }

  // Second: does ANY booking reference this service? service_id is `on delete
  // restrict`, so a service whose only bookings are past or cancelled passes
  // the check above and then fails at the foreign key — previously surfacing as
  // "Failed to delete service" with nothing actionable in it. force cannot
  // override a database constraint, so it does not get to skip this.
  const { count: totalReferences } = await admin
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('service_id', id)

  if ((totalReferences ?? 0) > 0) {
    return NextResponse.json(
      {
        error: `This service is attached to ${totalReferences} past or cancelled ${totalReferences === 1 ? 'booking' : 'bookings'} and cannot be deleted without losing that history. Hide it instead — set it to inactive and clients will no longer see it.`,
        bookingCount: totalReferences,
        canHide: true,
      },
      { status: 409 },
    )
  }

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

  return NextResponse.json({ deleted: true })
}
