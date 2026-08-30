import { createClient } from '@supabase/supabase-js'
import type { Category, Service } from '@/types'

/**
 * Fetch all active services ordered by category then name.
 * Uses the anon key directly (no cookies, no service role) — compatible with
 * ISR since NEXT_PUBLIC_* vars are always available at runtime.
 * Throws on Supabase error so Next.js error boundaries can catch it.
 */
export async function getActiveServices(): Promise<Service[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('category')
    .order('name')

  if (error) {
    console.error('[services] Failed to fetch active services:', error.message)
    throw new Error('Unable to load services. Please try again later.')
  }

  return data ?? []
}

/**
 * Fetch active categories in display order.
 *
 * Categories with no bookable service are omitted — an empty category in the
 * booking flow is a dead end, and Bash can hide a whole group simply by
 * deactivating its services.
 */
export async function getActiveCategories(): Promise<Category[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase
    .from('categories')
    .select('*, services(id)')
    .eq('active', true)
    .eq('services.active', true)
    .order('display_order')

  if (error) {
    console.error('[services] Failed to fetch categories:', error.message)
    throw new Error('Unable to load our service menu. Please try again later.')
  }

  // The joined services are only used to drop empty categories — map to the
  // Category shape explicitly rather than carrying the join through.
  return (data ?? [])
    .filter((c) => (c.services as unknown[] | null)?.length)
    .map((c): Category => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.image_url,
      display_order: c.display_order,
      active: c.active,
      created_at: c.created_at,
    }))
}

/** Groups services under their category id. Categories with none are absent. */
export function groupByCategory(services: Service[]): Map<string, Service[]> {
  const grouped = new Map<string, Service[]>()
  for (const service of services) {
    if (!service.category_id) continue
    const bucket = grouped.get(service.category_id)
    if (bucket) bucket.push(service)
    else grouped.set(service.category_id, [service])
  }
  return grouped
}
