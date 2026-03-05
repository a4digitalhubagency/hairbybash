import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components'
import { formatDate, formatTime, formatDuration } from '@/lib/format'
import type { FullBooking } from '@/lib/email'

interface Props {
  booking: FullBooking
  status: 'confirmed' | 'cancelled'
}

export default function BookingStatusUpdate({ booking, status }: Props) {
  const { service } = booking
  const isConfirmed = status === 'confirmed'

  const previewText = isConfirmed
    ? `Your ${service.name} appointment on ${booking.booking_date} is confirmed!`
    : `Your ${service.name} appointment on ${booking.booking_date} has been cancelled.`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>HairbyBash</Text>
            <Text style={logoSub}>Premium Hair Studio · Calgary, AB</Text>
          </Section>

          {/* Hero */}
          <Section style={hero}>
            <Text style={isConfirmed ? badgeConfirmed : badgeCancelled}>
              {isConfirmed ? 'CONFIRMED' : 'CANCELLED'}
            </Text>
            <Heading style={heroHeading}>
              {isConfirmed
                ? 'Your appointment is confirmed!'
                : 'Appointment update'}
            </Heading>
            <Text style={heroSub}>
              {isConfirmed
                ? `Hi ${booking.client_name}, Bash has confirmed your appointment. We can't wait to see you!`
                : `Hi ${booking.client_name}, unfortunately your appointment on ${formatDate(booking.booking_date)} has been cancelled.`}
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Booking Details */}
          <Section style={section}>
            <Heading style={sectionHeading}>Appointment Details</Heading>

            <Row style={detailRow}>
              <Column style={detailLabel}>Service</Column>
              <Column style={detailValue}>{service.name}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Date</Column>
              <Column style={detailValue}>{formatDate(booking.booking_date)}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Time</Column>
              <Column style={detailValue}>{formatTime(booking.start_time)}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Duration</Column>
              <Column style={detailValue}>{formatDuration(service.duration_minutes)}</Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Footer note */}
          <Section style={section}>
            <Text style={footerNote}>
              {isConfirmed
                ? 'Please arrive on time. If you need to reschedule, reply to this email or reach out via WhatsApp as soon as possible.'
                : 'We apologize for any inconvenience. Please visit our website to book a new appointment, or reach out to us directly.'}
            </Text>
            <Text style={signOff}>— Bash &amp; the HairbyBash team</Text>
          </Section>

          {/* Bottom bar */}
          <Section style={bottomBar}>
            <Text style={bottomText}>HairbyBash · Calgary, AB</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#F5F1EB',
  fontFamily: 'Georgia, serif',
  margin: 0,
  padding: '32px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  maxWidth: '560px',
  margin: '0 auto',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid #E8E2D9',
}

const header: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  padding: '28px 40px',
  textAlign: 'center',
}

const logo: React.CSSProperties = {
  color: '#C9A84C',
  fontSize: '24px',
  fontWeight: '700',
  margin: 0,
  letterSpacing: '0.05em',
}

const logoSub: React.CSSProperties = {
  color: 'rgba(255,255,255,0.45)',
  fontSize: '11px',
  margin: '4px 0 0',
  letterSpacing: '0.08em',
}

const hero: React.CSSProperties = {
  padding: '36px 40px 28px',
  textAlign: 'center',
}

const badgeConfirmed: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#F0FAF5',
  color: '#2A7A4B',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  padding: '5px 14px',
  borderRadius: '100px',
  border: '1px solid #B8E2CA',
  margin: '0 0 16px',
}

const badgeCancelled: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#FDF3F3',
  color: '#B84040',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  padding: '5px 14px',
  borderRadius: '100px',
  border: '1px solid #E8B8B8',
  margin: '0 0 16px',
}

const heroHeading: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: '26px',
  fontWeight: '700',
  margin: '0 0 10px',
}

const heroSub: React.CSSProperties = {
  color: '#5A5A5A',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: 0,
}

const divider: React.CSSProperties = {
  borderColor: '#EDE8E0',
  margin: '0 40px',
}

const section: React.CSSProperties = {
  padding: '24px 40px',
}

const sectionHeading: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  margin: '0 0 16px',
}

const detailRow: React.CSSProperties = {
  marginBottom: '10px',
}

const detailLabel: React.CSSProperties = {
  color: '#888',
  fontSize: '13px',
  width: '45%',
}

const detailValue: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: '13px',
  fontWeight: '500',
}

const footerNote: React.CSSProperties = {
  color: '#5A5A5A',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0 0 12px',
}

const signOff: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: 0,
}

const bottomBar: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  padding: '16px 40px',
  textAlign: 'center',
}

const bottomText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.35)',
  fontSize: '11px',
  margin: 0,
  letterSpacing: '0.06em',
}
