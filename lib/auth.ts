/**
 * Who counts as an admin.
 *
 * Deliberately free of server-only imports: middleware runs on the edge, where
 * `next/headers` does not exist, so pulling the route guard in through this
 * module would break the build. The guard lives in lib/auth-guard.ts.
 *
 * The claim lives in `app_metadata`, not `user_metadata`: app_metadata can only
 * be written with the service-role key, while user_metadata is editable by the
 * account holder. In the wrong one, a user could promote themselves.
 *
 * Grant it with `node scripts/grant-admin.mjs <email>`.
 */
import type { User } from '@supabase/supabase-js'

export const ADMIN_ROLE = 'admin'

/**
 * Not a type predicate on purpose: `isAdmin(u) === false` says nothing about
 * whether u is a User, so narrowing on it would collapse the else-branch to
 * never. Callers that need the user afterwards check `!user` separately.
 */
export function isAdmin(user: User | null | undefined): boolean {
  return user?.app_metadata?.role === ADMIN_ROLE
}
