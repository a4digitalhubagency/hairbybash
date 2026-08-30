import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAppUrl } from '@/lib/url'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // 303, not the default 307. A 307 preserves the method, so the browser would
  // re-POST to /admin/login; 303 is the status that means "now GET this page".
  return NextResponse.redirect(new URL('/admin/login', getAppUrl()), 303)
}
