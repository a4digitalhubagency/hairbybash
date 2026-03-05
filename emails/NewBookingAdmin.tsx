import {
  Body,
  Button,
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
import { formatDate, formatTime, formatDuration, formatPrice, calculateDeposit } from '@/lib/format'
import type { FullBooking } from '@/lib/email'

interface Props {
  booking: FullBooking
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hairbybash.ca'

export default function NewBookingAdmin({ booking }: Props) {
  const { service } = booking
  const { depositTotal } = calculateDeposit(service.price, service.deposit_percentage)

  return (
    <Html>
      <Head />
      <Preview>
        New booking: {booking.client_name} — {service.name} on {booking.booking_date}
      </Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>HairbyBash</Text>
            <Text style={logoSub}>Admin Notification</Text>
          </Section>

          {/* Hero */}
          <Section style={hero}>
            <Text style={badge}>NEW BOOKING</Text>
            <Heading style={heroHeading}>You have a new appointment!</Heading>
            <Text style={heroSub}>
              A client has paid their deposit and confirmed a booking. Review the details below.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Client Info */}
          <Section style={section}>
            <Heading style={sectionHeading}>Client</Heading>

            <Row style={detailRow}>
              <Column style={detailLabel}>Name</Column>
              <Column style={detailValue}>{booking.client_name}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Email</Column>
              <Column style={detailValue}>{booking.client_email}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Phone</Column>
              <Column style={detailValue}>{booking.client_phone}</Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Appointment Info */}
          <Section style={section}>
            <Heading style={sectionHeading}>Appointment</Heading>

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
            <Row style={detailRow}>
              <Column style={detailLabel}>Deposit received</Column>
              <Column style={{ ...detailValue, color: '#2A7A4B', fontWeight: '600' }}>
                {formatPrice(depositTotal)}
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={{ ...section, textAlign: 'center' }}>
            <Button href={`${APP_URL}/admin/dashboard`} style={ctaButton}>
              View in Dashboard
            </Button>
          </Section>

          {/* Bottom bar */}
          <Section style={bottomBar}>
            <Text style={bottomText}>HairbyBash Admin · Calgary, AB</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#F0F0F0',
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
  border: '1px solid #DCDCDC',
}

const header: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  padding: '24px 40px',
  textAlign: 'center',
}

const logo: React.CSSProperties = {
  color: '#C9A84C',
  fontSize: '22px',
  fontWeight: '700',
  margin: 0,
  letterSpacing: '0.05em',
}

const logoSub: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '11px',
  margin: '4px 0 0',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}

const hero: React.CSSProperties = {
  padding: '32px 40px 24px',
  textAlign: 'center',
}

const badge: React.CSSProperties = {
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

const heroHeading: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 10px',
}

const heroSub: React.CSSProperties = {
  color: '#5A5A5A',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
}

const divider: React.CSSProperties = {
  borderColor: '#E8E8E8',
  margin: '0 40px',
}

const section: React.CSSProperties = {
  padding: '24px 40px',
}

const sectionHeading: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  margin: '0 0 14px',
}

const detailRow: React.CSSProperties = {
  marginBottom: '10px',
}

const detailLabel: React.CSSProperties = {
  color: '#888',
  fontSize: '13px',
  width: '40%',
}

const detailValue: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: '13px',
  fontWeight: '500',
}

const ctaButton: React.CSSProperties = {
  backgroundColor: '#C9A84C',
  color: '#1A1A1A',
  fontSize: '13px',
  fontWeight: '700',
  padding: '13px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  letterSpacing: '0.03em',
}

const bottomBar: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  padding: '14px 40px',
  textAlign: 'center',
}

const bottomText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: '11px',
  margin: 0,
  letterSpacing: '0.06em',
}
