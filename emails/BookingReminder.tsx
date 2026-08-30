import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { formatDate, formatTime, formatDuration } from '@/lib/format'
import type { Booking, Service } from '@/types'

interface Props {
  booking: Booking & { service: Service }
}

const STUDIO_ADDRESS = '55 Edith Pass NW, Calgary, AB T3R 2B5'

export default function BookingReminder({ booking }: Props) {
  const { service } = booking

  return (
    <Html>
      <Head />
      <Preview>
        Tomorrow at {formatTime(booking.start_time)} — your {service.name} appointment with HairbyBash.
      </Preview>
      <Body style={body}>
        <Container style={container}>

          <Section style={header}>
            <Text style={brand}>HairbyBash</Text>
          </Section>

          <Section style={section}>
            <Heading style={h1}>See you tomorrow, {booking.client_name.split(' ')[0]}</Heading>
            <Text style={lead}>
              This is a reminder for your appointment tomorrow. Everything you need is below.
            </Text>
          </Section>

          <Section style={section}>
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
              <Column style={detailValue}>
                {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
              </Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Duration</Column>
              <Column style={detailValue}>{formatDuration(service.duration_minutes)}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Studio</Column>
              <Column style={detailValue}>{STUDIO_ADDRESS}</Column>
            </Row>
          </Section>

          <Section style={section}>
            <Text style={notice}>
              {booking.blow_dry_requested
                ? 'You asked us to detangle and blow dry your hair. That fee is charged in person on the day, on top of your service.'
                : 'Please arrive with your hair fully detangled and blow dried. If it has not been prepared, the blow dry fee will be charged in person on the day.'}
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={section}>
            <Heading style={sectionHeading}>Before you come</Heading>
            <Text style={policyText}>
              <strong>Arriving late —</strong> A 1-hour buffer is built into each appointment.
              Arriving 30 or more minutes late forfeits your deposit and the full service price
              becomes due.
            </Text>
            <Text style={policyText}>
              <strong>Your deposit —</strong> The deposit you paid is non-refundable under any
              circumstances. The remaining balance is due at your appointment.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={section}>
            <Text style={footerNote}>
              Need to reach us before tomorrow? Reply to this email or message us on WhatsApp.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#F4F2EE',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '32px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '10px',
  margin: '0 auto',
  maxWidth: '560px',
  overflow: 'hidden',
}

const header: React.CSSProperties = {
  backgroundColor: '#111111',
  padding: '22px 32px',
}

const brand: React.CSSProperties = {
  color: '#C9A227',
  fontSize: '17px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  margin: 0,
  textTransform: 'uppercase',
}

const section: React.CSSProperties = {
  padding: '0 32px',
}

const h1: React.CSSProperties = {
  color: '#111111',
  fontSize: '23px',
  fontWeight: 700,
  lineHeight: '1.3',
  margin: '28px 0 8px',
}

const lead: React.CSSProperties = {
  color: '#5A5A5A',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const sectionHeading: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  margin: '0 0 12px',
  textTransform: 'uppercase',
}

const detailRow: React.CSSProperties = {
  borderBottom: '1px solid #EFEDE8',
  padding: '11px 0',
}

const detailLabel: React.CSSProperties = {
  color: '#8A8A8A',
  fontSize: '13px',
  width: '35%',
}

const detailValue: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  fontWeight: 500,
  textAlign: 'right',
}

const notice: React.CSSProperties = {
  backgroundColor: '#FDF8EF',
  border: '1px solid #E8DFC8',
  borderRadius: '6px',
  color: '#5A5A5A',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '24px 0 0',
  padding: '12px 16px',
}

const policyText: React.CSSProperties = {
  color: '#5A5A5A',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 10px',
}

const divider: React.CSSProperties = {
  borderColor: '#EFEDE8',
  margin: '28px 32px',
}

const footerNote: React.CSSProperties = {
  color: '#8A8A8A',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 28px',
}
