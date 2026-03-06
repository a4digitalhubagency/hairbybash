import { Resend } from 'resend'
import { render } from '@react-email/components'
import BookingConfirmedClient from '@/emails/BookingConfirmedClient'
import NewBookingAdmin from '@/emails/NewBookingAdmin'
import BookingStatusUpdate from '@/emails/BookingStatusUpdate'
import BookingExpired from '@/emails/BookingExpired'
import type { Booking, Service } from '@/types'

// Lazy-initialized so missing RESEND_API_KEY doesn't throw at module load / build time.
// Each function creates the client on demand (runtime only).
function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL ?? 'HairbyBash <noreply@hairbybash.ca>'
}

export type FullBooking = Booking & { service: Service }

/** Sends client confirmation + admin new-booking alert in parallel. */
export async function sendBookingConfirmedEmails(booking: FullBooking): Promise<void> {
  const resend = getResend()
  const from = getFrom()
  const admin = process.env.RESEND_ADMIN_EMAIL ?? ''

  const [clientHtml, adminHtml] = await Promise.all([
    render(BookingConfirmedClient({ booking })),
    render(NewBookingAdmin({ booking })),
  ])

  await Promise.all([
    resend.emails.send({
      from,
      to: booking.client_email,
      subject: 'Your booking is confirmed — HairbyBash',
      html: clientHtml,
    }),
    admin
      ? resend.emails.send({
          from,
          to: admin,
          subject: `New booking: ${booking.client_name} — ${booking.booking_date}`,
          html: adminHtml,
        })
      : Promise.resolve(),
  ])
}

/** Sends a status-update email to the client when admin confirms or cancels. */
export async function sendStatusUpdateEmail(
  booking: FullBooking,
  status: 'confirmed' | 'cancelled',
): Promise<void> {
  const resend = getResend()
  const html = await render(BookingStatusUpdate({ booking, status }))

  await resend.emails.send({
    from: getFrom(),
    to: booking.client_email,
    subject:
      status === 'confirmed'
        ? 'Your appointment is confirmed — HairbyBash'
        : 'Appointment update — HairbyBash',
    html,
  })
}

/** Sends a short notification when the Stripe checkout session expires. */
export async function sendBookingExpiredEmail(
  clientEmail: string,
  bookingDate: string,
  serviceName: string,
): Promise<void> {
  const resend = getResend()
  const html = await render(BookingExpired({ bookingDate, serviceName }))

  await resend.emails.send({
    from: getFrom(),
    to: clientEmail,
    subject: 'Your booking slot was released — HairbyBash',
    html,
  })
}
