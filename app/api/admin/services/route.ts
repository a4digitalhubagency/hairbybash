import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('services')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('[services] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }

  return NextResponse.json({ services: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, price, deposit_percentage, duration_minutes, category_id, image_url, active } = body

  if (!name?.trim() || !category_id || price == null || !duration_minutes) {
    return NextResponse.json(
      { error: 'name, category_id, price and duration_minutes are required' },
      { status: 400 },
    )
  }

  const admin = createAdminClient()

  // The legacy `category` text column is kept in sync until the last reader is
  // migrated off it, so it is derived here rather than trusted from the client.
  const { data: category } = await admin
    .from('categories')
    .select('name')
    .eq('id', category_id)
    .maybeSingle()

  if (!category) {
    return NextResponse.json({ error: 'That category no longer exists' }, { status: 400 })
  }

  const depositPct = Number(deposit_percentage)

  const { data, error } = await admin
    .from('services')
    .insert({
      name: name.trim(),
      description: description?.trim() ?? '',
      price: Math.round(Number(price) * 100),
      // Only fall back when the field is absent — a deliberate 0% must survive.
      deposit_percentage: Number.isFinite(depositPct) ? depositPct : 20,
      duration_minutes: Number(duration_minutes),
      category_id,
      category: category.name,
      image_url: image_url?.trim() || null,
      active: active ?? true,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: `"${name.trim()}" already exists in that category.` },
        { status: 409 },
      )
    }
    console.error('[services] POST error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }

  return NextResponse.json({ service: data }, { status: 201 })
}
