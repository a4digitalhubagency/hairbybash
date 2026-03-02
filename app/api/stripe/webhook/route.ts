import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

// Must use nodejs runtime — edge runtime doesn't support stripe signature verification
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    console.error('[webhook] Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err)
    // Return 400 — Stripe will NOT retry on 4xx (intentional: bad signature = reject)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // ── checkout.session.completed ─────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId

    if (!bookingId) {
      console.error('[webhook] No bookingId in session metadata:', session.id)
      // Return 200 — this was our session but we logged the anomaly
      return NextResponse.json({ received: true })
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed', payment_status: 'paid' })
      .eq('id', bookingId)

    if (error) {
      console.error('[webhook] Failed to confirm booking:', bookingId, error)
      // Return 500 → Stripe retries with exponential backoff for up to 72 hours
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }

    console.log(`[webhook] Booking ${bookingId} confirmed (session: ${session.id})`)
  }

  // ── checkout.session.expired ───────────────────────────────────────────────
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId

    if (bookingId) {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('status', 'pending')  // only cancel if still pending — don't clobber confirmed

      if (error) {
        console.error('[webhook] Failed to cancel expired booking:', bookingId, error)
        // Return 500 → Stripe retries (safe: idempotent update)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }

      console.log(`[webhook] Booking ${bookingId} cancelled (session expired)`)
    }
  }

  return NextResponse.json({ received: true })
}
