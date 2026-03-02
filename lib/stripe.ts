/**
 * Stripe client singleton.
 * Only used server-side — the secret key is never sent to the browser.
 */
import Stripe from 'stripe'

// Use a placeholder during build so the module loads without throwing.
// At runtime, any request that actually uses Stripe will fail fast if the
// key is missing — this prevents build-time failures on Vercel when env
// vars haven't been configured yet.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder_not_set',
  {
    apiVersion: '2026-02-25.clover',
    typescript: true,
  },
)
