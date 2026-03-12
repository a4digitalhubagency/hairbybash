// Quick Resend smoke test — run with: node scripts/test-email.mjs
// Reads from .env.local automatically via dotenv

import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env.local manually (no external dotenv needed)
const envPath = resolve(process.cwd(), '.env.local')
const envLines = readFileSync(envPath, 'utf-8').split('\n')
for (const line of envLines) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.RESEND_FROM_EMAIL
const ADMIN = process.env.RESEND_ADMIN_EMAIL

if (!RESEND_API_KEY || !FROM || !ADMIN) {
  console.error('❌ Missing env vars. Check .env.local has RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_ADMIN_EMAIL')
  process.exit(1)
}

console.log('📧 Sending test email...')
console.log(`   From : ${FROM}`)
console.log(`   To   : ${ADMIN}`)

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: FROM,
    to: ADMIN,
    subject: '✅ HairbyBash — Resend test email',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px">
        <h2 style="color:#C9A84C">HairbyBash Email Test</h2>
        <p>If you're reading this, Resend is connected and working correctly.</p>
        <p style="color:#888;font-size:13px">Sent from: ${FROM}<br>API key prefix: ${RESEND_API_KEY.slice(0, 8)}...</p>
      </div>
    `,
  }),
})

const data = await res.json()

if (res.ok) {
  console.log(`\n✅ Success! Email sent. Resend ID: ${data.id}`)
  console.log(`   Check inbox at: ${ADMIN}`)
} else {
  console.error('\n❌ Failed:', JSON.stringify(data, null, 2))
  if (data?.message?.includes('domain')) {
    console.error('\n⚠️  Domain not verified yet in Resend. Add the DNS records first.')
  }
  if (data?.message?.includes('API key')) {
    console.error('\n⚠️  API key is invalid or expired.')
  }
}
