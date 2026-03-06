import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service | HairbyBash',
  description: 'Terms of service for HairbyBash — booking policies, deposits, cancellations, and client expectations.',
}

export default function TermsPage() {
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
              Terms of Service
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
              <h2 className="text-white font-semibold text-base mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing hairbybash.ca or booking an appointment, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use our website
                or services.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">2. Services</h2>
              <p>
                HairbyBash provides professional hair braiding, loc maintenance, and protective
                styling services from a private studio in Calgary, Alberta. All services are performed
                by appointment only. We reserve the right to refuse service at our discretion.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">3. Booking & Deposits</h2>
              <ul className="list-disc list-inside space-y-2 text-white/55">
                <li>A deposit is required at the time of booking to confirm your appointment.</li>
                <li>The deposit amount is determined by the service selected and is displayed at checkout.</li>
                <li>Your appointment is not confirmed until the deposit is successfully processed.</li>
                <li>The deposit is applied toward your total service balance due at the studio.</li>
                <li>We accept deposit payments via credit/debit card, processed securely through Stripe.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">4. Cancellations & Refunds</h2>
              <ul className="list-disc list-inside space-y-2 text-white/55">
                <li>
                  Cancellations made <strong className="text-white/70">more than 48 hours</strong>{' '}
                  before your appointment: contact us to discuss options.
                </li>
                <li>
                  Cancellations made <strong className="text-white/70">within 48 hours</strong>{' '}
                  of your appointment: the deposit is forfeited.
                </li>
                <li>
                  <strong className="text-white/70">No-shows</strong>: the deposit is forfeited and
                  you may be required to pay a new deposit to rebook.
                </li>
                <li>Deposits are non-refundable unless we cancel your appointment.</li>
                <li>If we must cancel due to unforeseen circumstances, you will receive a full refund of your deposit.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">5. Rescheduling</h2>
              <p>
                To reschedule your appointment, please contact us as early as possible. Rescheduling
                requests made more than 48 hours in advance will be accommodated subject to
                availability. Rescheduling within 48 hours is not guaranteed and may result in
                forfeiture of the deposit.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">6. Lateness</h2>
              <p>
                Please arrive on time for your appointment. Arriving more than 15 minutes late may
                result in a shortened service or rescheduling at our discretion. Repeated lateness
                may result in a required deposit increase for future bookings.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">7. Hair Preparation</h2>
              <p className="mb-3">
                To receive the best results and respect all clients&apos; time, please arrive with:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-white/55">
                <li>Clean, freshly washed hair (unless otherwise specified)</li>
                <li>Detangled, blow-dried, or stretched hair</li>
                <li>The required extension hair for your service (we will advise you on quantity and brand)</li>
              </ul>
              <p className="mt-3">
                Failure to arrive with hair in the proper condition may result in an additional prep
                fee or rescheduling of your appointment.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">8. Studio Conduct</h2>
              <p>
                HairbyBash is a private, professional studio. We ask that clients be respectful of
                the space and other clients. We reserve the right to end a service and ask a client
                to leave if conduct is disruptive, abusive, or otherwise unacceptable.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">9. Satisfaction</h2>
              <p>
                We take pride in our work and want you to love your results. If you have any concerns
                about your service, please raise them before leaving the studio. We are unable to
                offer refunds for completed services, but we will do our best to address concerns
                raised at the time of your appointment.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">10. Limitation of Liability</h2>
              <p>
                HairbyBash is not liable for any allergic reactions, hair breakage, or damage
                resulting from pre-existing hair or scalp conditions, or from failure to follow
                aftercare instructions. We are also not responsible for any items left in the studio.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">11. Changes to Terms</h2>
              <p>
                We reserve the right to update these Terms of Service at any time. Changes will be
                posted on this page with an updated date. Continued use of our services after changes
                constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">12. Governing Law</h2>
              <p>
                These terms are governed by the laws of the Province of Alberta and the federal laws
                of Canada applicable therein.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-base mb-3">13. Contact</h2>
              <p>
                Questions about these terms? Reach out via our{' '}
                <Link href="/contact" className="text-gold hover:underline">
                  Contact page
                </Link>{' '}
                or email{' '}
                <a href="mailto:hello@hairbybash.ca" className="text-gold hover:underline">
                  hello@hairbybash.ca
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
