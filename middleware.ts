import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_ROLE } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          ),
      },
    },
  )

  // getUser() validates the session against Supabase — cannot be spoofed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  // Signed in is not the same as authorised. The dashboard is backed by the
  // service-role key, so a bare "is there a user?" check would admit anyone who
  // registered an account. The role lives in app_metadata, which only the
  // service-role key can write — see lib/auth.ts.
  const authorised = user?.app_metadata?.role === ADMIN_ROLE

  // Already an admin — no reason to sit on the login page
  if (isLoginPage && authorised) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  // Signed in without the role: send them back to the login page rather than
  // the dashboard, so a non-admin account cannot loop into a shell it may not
  // see. The routes behind it return 403 regardless.
  if (!isLoginPage && !authorised) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
