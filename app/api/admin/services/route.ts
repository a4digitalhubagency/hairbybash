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
  const { name, description, price, deposit_percentage, duration_minutes, category, image_url, active } = body

  if (!name?.trim() || !category || price == null || !duration_minutes) {
    return NextResponse.json(
      { error: 'name, category, price and duration_minutes are required' },
      { status: 400 },
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('services')
    .insert({
      name: name.trim(),
      description: description?.trim() ?? '',
      price: Math.round(Number(price) * 100),
      deposit_percentage: Number(deposit_percentage) || 50,
      duration_minutes: Number(duration_minutes),
      category,
      image_url: image_url?.trim() || null,
      active: active ?? true,
    })
    .select()
    .single()

  if (error) {
    console.error('[services] POST error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }

  return NextResponse.json({ service: data }, { status: 201 })
}
