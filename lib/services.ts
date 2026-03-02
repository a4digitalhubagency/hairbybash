import { createAdminClient } from '@/lib/supabase/admin'
import type { Service } from '@/types'

/**
 * Fetch all active services ordered by category then name.
 * Uses the admin client (no cookies) so this is compatible with ISR — services
 * are public data and do not require user authentication.
 * Throws on Supabase error so Next.js error boundaries can catch it.
 */
export async function getActiveServices(): Promise<Service[]> {
  const supabase = createAdminClient()

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
