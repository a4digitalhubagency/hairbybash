/**
 * Admin Supabase client using the service role key.
 * ONLY use this in trusted server contexts (Route Handlers, Server Actions).
 * This bypasses ALL Row Level Security — never expose to the client.
 */
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
