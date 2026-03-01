import { createClient } from '@/lib/supabase/server'
import type { Service } from '@/types'

/**
 * Fetch all active services ordered by category then name.
 * Throws on Supabase error so Next.js error boundaries can catch it.
 */
export async function getActiveServices(): Promise<Service[]> {
  const supabase = await createClient()

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
