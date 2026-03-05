import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { formatDate } from '@/lib/format'

interface Props {
  bookingDate: string
  serviceName: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hairbybash.ca'

export default function BookingExpired({ bookingDate, serviceName }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your booking slot for {serviceName} on {bookingDate} was released — book again anytime.</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>HairbyBash</Text>
            <Text style={logoSub}>Premium Hair Studio · Calgary, AB</Text>
          </Section>

          {/* Body */}
          <Section style={contentSection}>
            <Heading style={heading}>Your booking slot was released</Heading>
            <Text style={subText}>
              Your reservation for <strong>{serviceName}</strong> on{' '}
              <strong>{formatDate(bookingDate)}</strong> was not completed within the
              30-minute payment window, so the slot has been released.
            </Text>
            <Text style={subText}>
              No payment was taken. You&apos;re welcome to book again at any time — just
              head back to our website and select a new date.
            </Text>

            <Section style={ctaSection}>
              <Button href={`${APP_URL}/services`} style={ctaButton}>
                Book Again
              </Button>
            </Section>

            <Text style={helpText}>
              If you have any questions or need help choosing a service, feel free to
              reach out on WhatsApp or reply to this email.
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
  maxWidth: '520px',
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

const contentSection: React.CSSProperties = {
  padding: '36px 40px 28px',
}

const heading: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 18px',
}

const subText: React.CSSProperties = {
  color: '#5A5A5A',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0 0 14px',
}

const ctaSection: React.CSSProperties = {
  margin: '24px 0',
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

const helpText: React.CSSProperties = {
  color: '#888',
  fontSize: '13px',
  lineHeight: '1.6',
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
