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
import { formatDate, formatTime, formatDuration, formatPrice, calculateDeposit } from '@/lib/format'
import type { FullBooking } from '@/lib/email'

interface Props {
  booking: FullBooking
}

export default function BookingConfirmedClient({ booking }: Props) {
  const { service } = booking
  const { depositBase, depositGST, depositTotal, remainder } = calculateDeposit(
    service.price,
    service.deposit_percentage,
  )

  return (
    <Html>
      <Head />
      <Preview>Payment received — your HairbyBash appointment is booked.</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>HairbyBash</Text>
            <Text style={logoSub}>Premium Hair Studio · Calgary, AB</Text>
          </Section>

          {/* Hero */}
          <Section style={hero}>
            <Text style={checkmark}>✓</Text>
            <Heading style={heroHeading}>Booking Confirmed</Heading>
            <Text style={heroSub}>
              Hi {booking.client_name}, your deposit has been received and your appointment is locked in.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Booking Details */}
          <Section style={section}>
            <Heading style={sectionHeading}>Your Appointment</Heading>

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

          {/* Payment Summary */}
          <Section style={section}>
            <Heading style={sectionHeading}>Payment Summary</Heading>

            <Row style={detailRow}>
              <Column style={detailLabel}>Service price</Column>
              <Column style={detailValue}>{formatPrice(service.price)}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Deposit ({service.deposit_percentage}%)</Column>
              <Column style={detailValue}>{formatPrice(depositBase)}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>GST (5%)</Column>
              <Column style={detailValue}>{formatPrice(depositGST)}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={{ ...detailLabel, fontWeight: '600', color: '#1A1A1A' }}>
                Deposit paid
              </Column>
              <Column style={{ ...detailValue, fontWeight: '600', color: '#B8922A' }}>
                {formatPrice(depositTotal)}
              </Column>
            </Row>

            <Section style={remainderBox}>
              <Text style={remainderText}>
                Balance due on the day of your appointment:{' '}
                <span style={{ fontWeight: '600', color: '#1A1A1A' }}>{formatPrice(remainder)}</span>
              </Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer note */}
          <Section style={section}>
            <Text style={footerNote}>
              Need to reschedule or have questions? Reply to this email or reach out on WhatsApp.
              We look forward to seeing you!
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

const checkmark: React.CSSProperties = {
  display: 'inline-block',
  width: '48px',
  height: '48px',
  lineHeight: '48px',
  textAlign: 'center',
  backgroundColor: '#F5F0E8',
  borderRadius: '50%',
  color: '#B8922A',
  fontSize: '22px',
  fontWeight: '700',
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

const remainderBox: React.CSSProperties = {
  backgroundColor: '#F9F6F0',
  border: '1px solid #E8E2D9',
  borderRadius: '6px',
  padding: '14px 16px',
  marginTop: '16px',
}

const remainderText: React.CSSProperties = {
  color: '#5A5A5A',
  fontSize: '13px',
  margin: 0,
  lineHeight: '1.5',
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
