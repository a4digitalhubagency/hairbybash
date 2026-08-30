#!/usr/bin/env node
/**
 * Grants or revokes the admin role on a Supabase account.
 *
 *   node scripts/grant-admin.mjs bash@example.com
 *   node scripts/grant-admin.mjs bash@example.com --revoke
 *   node scripts/grant-admin.mjs --list
 *
 * The role lives in app_metadata, which only the service-role key can write —
 * a user cannot promote themselves. Reads credentials from .env.local or .env.
 *
 * Run this for every admin account BEFORE deploying a build that enforces the
 * role, or the dashboard locks its own owner out.
 */
import { readFileSync, existsSync } from 'node:fs'

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '')
      }
    }
  }
}

loadEnv()

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!URL || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
}

async function listUsers() {
  const res = await fetch(`${URL}/auth/v1/admin/users`, { headers })
  if (!res.ok) throw new Error(`Could not list users: ${res.status} ${await res.text()}`)
  const body = await res.json()
  return body.users ?? []
}

const args = process.argv.slice(2)
const revoke = args.includes('--revoke')
const email = args.find((a) => !a.startsWith('--'))

const users = await listUsers()

if (args.includes('--list') || !email) {
  console.log(`\n${users.length} account(s):\n`)
  for (const user of users) {
    const role = user.app_metadata?.role
    console.log(`  ${role === 'admin' ? 'ADMIN' : '     '}  ${user.email}`)
  }
  if (!email) {
    console.log('\nUsage: node scripts/grant-admin.mjs <email> [--revoke]\n')
  }
  process.exit(0)
}

const target = users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
if (!target) {
  console.error(`No account found for ${email}. Known: ${users.map((u) => u.email).join(', ')}`)
  process.exit(1)
}

const res = await fetch(`${URL}/auth/v1/admin/users/${target.id}`, {
  method: 'PUT',
  headers,
  // Supabase merges app_metadata, so this leaves provider details intact.
  body: JSON.stringify({ app_metadata: { role: revoke ? null : 'admin' } }),
})

if (!res.ok) {
  console.error(`Failed: ${res.status} ${await res.text()}`)
  process.exit(1)
}

const updated = await res.json()
const role = updated.app_metadata?.role ?? 'none'
console.log(`${revoke ? 'Revoked' : 'Granted'} — ${target.email} now has role: ${role}`)
