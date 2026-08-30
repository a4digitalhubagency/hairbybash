import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('categories')
    .select('name, slug')
    .eq('id', id)
    .maybeSingle()

  if (!existing) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

  const updates: Record<string, unknown> = {}

  if (body.name !== undefined) {
    const name = String(body.name).trim()
    if (!name) return NextResponse.json({ error: 'Category name cannot be empty' }, { status: 400 })
    updates.name = name

    // Regenerate the slug ONLY when the name actually changed. The edit form
    // always submits every field, so re-deriving unconditionally would rewrite
    // the public URL when someone only touched the description — and a
    // hand-picked slug ("kids" for "Kids (5–14)") would be silently replaced.
    if (name !== existing.name) {
      const slug = toSlug(name)
      if (!slug) {
        return NextResponse.json(
          { error: 'That name has no letters or numbers to build a web address from.' },
          { status: 400 },
        )
      }
      updates.slug = slug
    }
  }

  if (body.description !== undefined) {
    updates.description = String(body.description).trim() || null
  }
  if (body.image_url !== undefined) {
    updates.image_url = String(body.image_url ?? '').trim() || null
  }
  if (body.display_order !== undefined) {
    const order = Number(body.display_order)
    if (!Number.isFinite(order)) {
      return NextResponse.json({ error: 'Display order must be a number' }, { status: 400 })
    }
    updates.display_order = order
  }
  if (body.active !== undefined) updates.active = Boolean(body.active)

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data, error } = await admin
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Another category already uses that name.' }, { status: 409 })
    }
    console.error('[admin/categories/[id]] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

  return NextResponse.json({ category: data })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const admin = createAdminClient()

  // services.category_id is `on delete restrict`, so a category holding any
  // service cannot be deleted. Check first and say so plainly — letting the
  // foreign key fire returns an opaque 500 with nothing actionable in it.
  const { count } = await admin
    .from('services')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      {
        error: `This category still holds ${count} ${count === 1 ? 'service' : 'services'}. Move or delete them first, or hide the category instead.`,
        serviceCount: count,
      },
      { status: 409 },
    )
  }

  const { data, error } = await admin
    .from('categories')
    .delete()
    .eq('id', id)
    .select('id')

  if (error) {
    console.error('[admin/categories/[id]] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
