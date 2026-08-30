import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/** "Faux Locs" -> "faux-locs". Slugs are how the public pages address a category. */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('categories')
    .select('*, services(id)')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[admin/categories] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }

  // serviceCount drives the delete guard in the UI — a category holding
  // services cannot be removed without moving them first.
  const categories = (data ?? []).map(({ services, ...category }) => ({
    ...category,
    serviceCount: (services as unknown[] | null)?.length ?? 0,
  }))

  return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) return NextResponse.json({ error: 'Category name is required' }, { status: 400 })

  const slug = toSlug(name)
  if (!slug) {
    return NextResponse.json(
      { error: 'That name has no letters or numbers to build a web address from.' },
      { status: 400 },
    )
  }

  const admin = createAdminClient()

  // Append to the end unless a position is given.
  let displayOrder = Number(body.display_order)
  if (!Number.isFinite(displayOrder)) {
    const { data: last } = await admin
      .from('categories')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    displayOrder = (last?.display_order ?? 0) + 1
  }

  const { data, error } = await admin
    .from('categories')
    .insert({
      name,
      slug,
      description: typeof body.description === 'string' ? body.description.trim() || null : null,
      image_url: typeof body.image_url === 'string' ? body.image_url.trim() || null : null,
      display_order: displayOrder,
      active: body.active ?? true,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: `A category called "${name}" already exists.` },
        { status: 409 },
      )
    }
    console.error('[admin/categories] POST error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }

  return NextResponse.json({ category: data }, { status: 201 })
}
