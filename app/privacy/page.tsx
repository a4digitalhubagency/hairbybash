import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | HairbyBash',
  description: 'Privacy policy for HairbyBash — how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-dark">

        {/* Hero */}
        <section className="relative pt-32 pb-12 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-dark-surface via-dark to-dark pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-medium">Legal</p>
            <h1 className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl text-white leading-tight mb-5">
              Privacy Policy
            </h1>
            <p className="text-white/40 text-sm">
              Last updated: March 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="pb-24 px-6">
          <div className="max-w-3xl mx-auto space-y-10 text-white/60 text-sm leading-relaxed">

            <div>
              <h2 className="text-white font-semibold text-base mb-3">1. Introduction</h2>
              <p>
                HairbyBash (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website hairbybash.ca. This Privacy Policy
                explains what information we collect, how we use it, and how we protect it when you use
                our website or book an appointment with us.
              </p>
              <p className="mt-3">
                By using our website or booking a service, you agree to the collection and use of
                information as described in this policy.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect the following information when you book an appointment:</p>
              <ul className="list-disc list-inside space-y-1.5 text-white/55">
                <li>Your full name and email address</li>
                <li>Phone number (if provided)</li>
                <li>The service(s) you book and your preferred date and time</li>
                <li>Payment information (processed securely by Stripe — we never store your card details)</li>
                <li>Any notes or special requests you submit with your booking</li>
              </ul>
              <p className="mt-3">
                We may also collect non-personal usage data such as browser type, pages visited, and
                referring URLs through standard web analytics.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-white/55">
                <li>Confirm and manage your appointment bookings</li>
                <li>Send booking confirmation and reminder emails</li>
                <li>Process deposit and balance payments via Stripe</li>
                <li>Respond to your inquiries via email or WhatsApp</li>
                <li>Improve our website and service offerings</li>
              </ul>
              <p className="mt-3">
                We do not sell, rent, or share your personal information with third parties for
                marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">4. Payment Processing</h2>
              <p>
                All payments are processed by <strong className="text-white/80">Stripe</strong>, a
                PCI-DSS compliant payment processor. We never store your credit or debit card details
                on our servers. Please review{' '}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  Stripe&apos;s Privacy Policy
                </a>{' '}
                for details on how they handle payment data.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">5. Data Retention</h2>
              <p>
                We retain your booking information for as long as necessary to provide our services
                and comply with our legal obligations. You may request deletion of your data at any
                time by contacting us.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">6. Cookies</h2>
              <p>
                Our website may use essential cookies to maintain your session and ensure the booking
                system functions correctly. We do not use tracking or advertising cookies.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">7. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-white/55">
                <li>Request access to the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:hairbybash01@gmail.com" className="text-gold hover:underline">
                  hairbybash01@gmail.com
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">8. Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. All
                data is transmitted over HTTPS.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this
                page with an updated date. Continued use of our website or services after changes
                constitutes your acceptance of the revised policy.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please reach out via our{' '}
                <Link href="/contact" className="text-gold hover:underline">
                  Contact page
                </Link>{' '}
                or email{' '}
                <a href="mailto:hairbybash01@gmail.com" className="text-gold hover:underline">
                  hairbybash01@gmail.com
                </a>
                .
              </p>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
