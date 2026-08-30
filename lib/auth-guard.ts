/**
 * Route-handler guard for the admin API.
 *
 * Every admin route is backed by the service-role key, which bypasses row-level
 * security entirely. Until now the only question asked was "is someone signed
 * in?" — never "who?" — so with public signup enabled on the Supabase project,
 * anyone who registered could reach the dashboard.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'

/**
 * Returns a response to send back, or null when the caller may proceed:
 *
 *     const denied = await requireAdmin()
 *     if (denied) return denied
 *
 * 401 means "we do not know who you are"; 403 means "we do, and you may not".
 * Worth distinguishing — the second is the one worth looking into.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin(user)) {
    console.warn(`[auth] non-admin account reached an admin route: ${user.email}`)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}
