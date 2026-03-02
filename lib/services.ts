import { createClient } from '@supabase/supabase-js'
import type { Service } from '@/types'

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
