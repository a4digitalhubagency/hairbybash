import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

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

  // Already authenticated — redirect away from login page
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  // Not authenticated — redirect to login
  if (!isLoginPage && !user) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
