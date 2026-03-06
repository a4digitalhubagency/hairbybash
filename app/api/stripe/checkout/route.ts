import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'
import { getAvailableSlots } from '@/lib/availability'
import { getAppUrl } from '@/lib/url'

interface CheckoutBody {
  serviceId: string
  date: string       // YYYY-MM-DD
  startTime: string  // HH:MM
  endTime: string    // HH:MM
  clientName: string
  clientEmail: string
  clientPhone: string
}

export async function POST(req: NextRequest) {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let body: CheckoutBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { serviceId, date, startTime, endTime, clientName, clientEmail, clientPhone } = body

  // ── 2. Input validation ────────────────────────────────────────────────────
  const errors: string[] = []
  if (!serviceId)                              errors.push('serviceId required')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))     errors.push('Invalid date format (YYYY-MM-DD)')
  if (!/^\d{2}:\d{2}$/.test(startTime))       errors.push('Invalid startTime format (HH:MM)')
  if (!/^\d{2}:\d{2}$/.test(endTime))         errors.push('Invalid endTime format (HH:MM)')
  if (!clientName?.trim())                     errors.push('Client name is required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail ?? ''))
                                               errors.push('Invalid email address')
  if (!clientPhone?.trim())                    errors.push('Phone number is required')

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join('; ') }, { status: 400 })
  }

  // Reject past dates
  const today = new Date().toISOString().slice(0, 10)
  if (date < today) {
    return NextResponse.json({ error: 'Cannot book a past date' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // ── 3. Fetch and validate service ──────────────────────────────────────────
  const { data: service, error: serviceErr } = await supabase
    .from('services')
    .select('id, name, price, deposit_percentage, duration_minutes')
    .eq('id', serviceId)
    .eq('active', true)
    .single()

  if (serviceErr || !service) {
    return NextResponse.json({ error: 'Service not found or no longer available' }, { status: 400 })
  }

  // ── 4. Server-side slot conflict check ────────────────────────────────────
  // Re-run availability to prevent race conditions (two users booking the same slot).
  let slots
  try {
    ;({ slots } = await getAvailableSlots(date, serviceId))
  } catch {
    return NextResponse.json(
      { error: 'Unable to verify availability. Please try again.' },
      { status: 500 },
    )
  }

  const requestedSlot = slots.find(
    (s) => s.start === startTime && s.end === endTime,
  )

  if (!requestedSlot || !requestedSlot.available) {
    return NextResponse.json(
      { error: 'This time slot is no longer available. Please choose another.' },
      { status: 409 },
    )
  }

  // ── 5. Create PENDING booking ──────────────────────────────────────────────
  const { data: booking, error: bookingErr } = await supabase
    .from('bookings')
    .insert({
      service_id: serviceId,
      client_name: clientName.trim(),
      client_email: clientEmail.trim().toLowerCase(),
      client_phone: clientPhone.trim(),
      booking_date: date,
      start_time: startTime + ':00',  // DB stores as HH:MM:SS
      end_time: endTime + ':00',
      status: 'pending',
      payment_status: 'unpaid',
      stripe_session_id: null,
    })
    .select('id')
    .single()

  if (bookingErr || !booking) {
    console.error('[checkout] Booking insert failed:', bookingErr)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }

  // ── 6. Calculate deposit amount ────────────────────────────────────────────
  // depositBase = price * deposit_percentage / 100
  // Add GST (5% Canadian) on top of the deposit
  const depositBase = Math.round(service.price * service.deposit_percentage / 100)
  const depositWithGST = Math.round(depositBase * 1.05)

  // ── 7. Create Stripe Checkout session ─────────────────────────────────────
  const appUrl = getAppUrl()

  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            unit_amount: depositWithGST,
            product_data: {
              name: `Deposit — ${service.name}`,
              description: `${service.deposit_percentage}% deposit (incl. 5% GST). Remainder due at appointment.`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        serviceId: serviceId,
        date: date,
        startTime: startTime,
        clientEmail: clientEmail.trim().toLowerCase(),
      },
      customer_email: clientEmail.trim().toLowerCase(),
      success_url: `${appUrl}/book/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/book`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,  // 30-minute window
    })
  } catch (stripeErr) {
    console.error('[checkout] Stripe session creation failed:', stripeErr)
    // Roll back the pending booking so the slot is freed immediately
    await supabase.from('bookings').delete().eq('id', booking.id)
    return NextResponse.json(
      { error: 'Failed to initiate payment. Please try again.' },
      { status: 500 },
    )
  }

  // ── 8. Store session ID on the booking ────────────────────────────────────
  const { error: updateErr } = await supabase
    .from('bookings')
    .update({ stripe_session_id: session.id })
    .eq('id', booking.id)

  if (updateErr) {
    // Session was created but we couldn't store it — log and continue.
    // Webhook will still fire and can still update the booking by bookingId in metadata.
    console.error('[checkout] Failed to store stripe_session_id:', updateErr)
  }

  return NextResponse.json({ url: session.url })
}
