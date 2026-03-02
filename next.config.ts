import type { NextConfig } from 'next'

// ── Required environment variables ────────────────────────────────────────────
// Validated at build time so Vercel fails fast with a clear message rather than
// shipping a broken deployment that only errors at runtime.
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL',
] as const

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(
      `\n\n❌ Missing required environment variable: ${key}\n` +
      `   Add it to your .env.local (dev) or Vercel project settings (prod).\n`,
    )
  }
}

const nextConfig: NextConfig = {}

export default nextConfig
