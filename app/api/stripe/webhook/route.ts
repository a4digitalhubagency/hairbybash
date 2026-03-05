import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  sendBookingConfirmedEmails,
  sendBookingExpiredEmail,
  type FullBooking,
} from '@/lib/email'
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

    // Guard with .eq('status', 'pending') — idempotent: if Stripe retries this webhook
    // after a slow response, the update is a no-op and we skip sending duplicate emails.
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed', payment_status: 'paid' })
      .eq('id', bookingId)
      .eq('status', 'pending')
      .select('id')

    if (error) {
      console.error('[webhook] Failed to confirm booking:', bookingId, error)
      // Return 500 → Stripe retries with exponential backoff for up to 72 hours
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }

    const wasConfirmed = updated && updated.length > 0
    console.log(`[webhook] Booking ${bookingId} ${wasConfirmed ? 'confirmed' : 'already confirmed — skipping email'} (session: ${session.id})`)

    // Only send emails if we actually changed the status (not a duplicate webhook delivery)
    if (wasConfirmed) {
      try {
        const { data: fullBooking } = await supabase
          .from('bookings')
          .select('*, service:services(*)')
          .eq('id', bookingId)
          .single()
        if (fullBooking) await sendBookingConfirmedEmails(fullBooking as FullBooking)
      } catch (emailErr) {
        console.error('[webhook] Email send failed (non-fatal):', emailErr)
      }
    }
  }

  // ── checkout.session.expired ───────────────────────────────────────────────
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId

    if (bookingId) {
      const { data: updated, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('status', 'pending')  // only cancel if still pending — don't clobber confirmed
        .select('id')

      if (error) {
        console.error('[webhook] Failed to cancel expired booking:', bookingId, error)
        // Return 500 → Stripe retries (safe: idempotent update)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }

      const wasCancelled = updated && updated.length > 0
      console.log(`[webhook] Booking ${bookingId} ${wasCancelled ? 'cancelled' : 'already resolved — skipping email'} (session expired)`)

      // Only notify client if we actually cancelled (not a duplicate webhook or already-confirmed booking)
      if (wasCancelled) {
        try {
          const clientEmail = session.metadata?.clientEmail ?? session.customer_email
          const bookingDate = session.metadata?.date ?? ''
          const serviceId = session.metadata?.serviceId
          let serviceName = 'your service'
          if (serviceId) {
            const { data: svc } = await supabase
              .from('services')
              .select('name')
              .eq('id', serviceId)
              .single()
            if (svc) serviceName = svc.name
          }
          if (clientEmail) {
            await sendBookingExpiredEmail(clientEmail, bookingDate, serviceName)
          }
        } catch (emailErr) {
          console.error('[webhook] Expired email send failed (non-fatal):', emailErr)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
