import type { NextConfig } from 'next'

// ── Environment variable validation ───────────────────────────────────────────
// Core Supabase vars — throw at build time so the deploy fails fast.
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(
      `\n\n❌ Missing required environment variable: ${key}\n` +
      `   Add it to your .env.local (dev) or Vercel project settings (prod).\n`,
    )
  }
}

// Stripe + app URL + email — warn only (needed before payments/emails go live).
const RECOMMENDED_ENV_VARS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'RESEND_ADMIN_EMAIL',
] as const

for (const key of RECOMMENDED_ENV_VARS) {
  if (!process.env[key]) {
    console.warn(`⚠️  Environment variable ${key} is not set. Required before payments go live.`)
  }
}

const supabaseHostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
