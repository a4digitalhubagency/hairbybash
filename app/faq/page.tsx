'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

const FAQS = [
  {
    section: 'Booking & Appointments',
    items: [
      {
        q: 'How do I book an appointment?',
        a: 'You can book directly through our website by clicking "Book Now". Choose your service, select a date and time, fill in your details, and complete the deposit payment to secure your spot.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 1–2 weeks in advance, especially for longer services like full braiding sets or loc installations. Weekend slots fill up quickly.',
      },
      {
        q: 'Can I book for a specific stylist?',
        a: 'HairbyBash is a private, solo studio — Bash is your stylist for every appointment. You\'ll always receive the same expert, personalized care.',
      },
      {
        q: 'Do you accept walk-ins?',
        a: 'We operate by appointment only to ensure every client receives dedicated, uninterrupted time. Please book online to secure your slot.',
      },
    ],
  },
  {
    section: 'Deposits & Payments',
    items: [
      {
        q: 'Is a deposit required?',
        a: 'Yes, a deposit is required at the time of booking to secure your appointment. The deposit amount varies by service and is applied toward your total balance.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'Deposits are paid securely online via credit or debit card through Stripe. The remaining balance can be paid at the studio by cash, e-transfer, or card.',
      },
      {
        q: 'Is the deposit refundable?',
        a: 'Deposits are non-refundable if you cancel within 48 hours of your appointment or do not show up. If you cancel more than 48 hours in advance, please contact us to discuss options.',
      },
    ],
  },
  {
    section: 'Services & Hair Care',
    items: [
      {
        q: 'What services do you offer?',
        a: 'We offer a full range of protective and natural hair services including knotless braids, loc installation and maintenance, twists, cornrows, and more. Browse the full menu on our Services page.',
      },
      {
        q: 'Do I need to come with washed hair?',
        a: 'Yes — please arrive with clean, detangled, and blow-dried hair unless otherwise specified. This ensures the best results and respects everyone\'s time.',
      },
      {
        q: 'Do you provide hair (extensions)?',
        a: 'Extensions are not included in the service price. You\'ll receive a recommended hair list when you book, or you can contact us in advance for guidance.',
      },
      {
        q: 'How long do braids or locs last?',
        a: 'Knotless braids typically last 4–8 weeks with proper care. Locs are a long-term commitment and require regular maintenance appointments. Longevity depends on your hair type and aftercare routine.',
      },
      {
        q: 'Do you work with all hair types?',
        a: 'Absolutely. We specialize in natural, textured hair of all types and lengths. Every service is tailored to your specific hair needs.',
      },
    ],
  },
  {
    section: 'Studio & Location',
    items: [
      {
        q: 'Where is the studio located?',
        a: 'HairbyBash is a private home studio in Calgary, Alberta. The exact address is shared with clients after their booking is confirmed — this protects our private studio environment.',
      },
      {
        q: 'What are your hours?',
        a: 'We operate Monday through Sunday, 9am–6pm. Hours may vary — check availability when booking online.',
      },
      {
        q: 'Can I bring someone with me?',
        a: 'To maintain the calm, focused environment of a private studio, we ask that you come alone unless you\'ve arranged otherwise in advance.',
      },
    ],
  },
  {
    section: 'Cancellations & No-Shows',
    items: [
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations made more than 48 hours before your appointment are handled on a case-by-case basis. Cancellations within 48 hours or no-shows will result in forfeiture of the deposit.',
      },
      {
        q: 'What if I need to reschedule?',
        a: 'Life happens! Contact us as soon as possible and we\'ll do our best to find a new slot. Rescheduling requests made within 48 hours may not be guaranteed.',
      },
      {
        q: 'What happens if I\'m late?',
        a: 'Please let us know if you\'re running late. Arriving more than 15 minutes late may result in a shortened service or rescheduling to avoid impacting other clients.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-white/3 transition-colors"
        aria-expanded={open}
      >
        <span className="text-white text-sm font-medium leading-snug">{q}</span>
        <svg
          className={`w-4 h-4 text-gold shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 text-white/55 text-sm leading-relaxed border-t border-white/5 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="bg-dark">

        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-dark-surface via-dark to-dark pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-medium">
              Got Questions?
            </p>
            <h1 className="font-(family-name:--font-playfair) font-bold text-5xl md:text-6xl text-white leading-tight mb-5">
              Policies &amp; FAQ
            </h1>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Everything you need to know before your appointment — from booking and
              deposits to hair prep and studio etiquette.
            </p>
          </div>
        </section>

        {/* FAQ sections */}
        <section className="pb-24 px-6">
          <div className="max-w-3xl mx-auto space-y-14">
            {FAQS.map((section) => (
              <div key={section.section}>
                <h2 className="text-gold text-xs tracking-[0.25em] uppercase font-semibold mb-5">
                  {section.section}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still have questions */}
        <section className="py-20 px-6 text-center border-t border-white/5">
          <div className="max-w-md mx-auto">
            <span className="text-gold text-xl">♦</span>
            <h2 className="font-(family-name:--font-playfair) font-bold text-3xl text-white mt-4 mb-3">
              Still have questions?
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-8">
              We&apos;re happy to help. Reach out and Bash will get back to you personally.
            </p>
            <Link
              href="/contact"
              className="inline-block px-7 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-gold-hover transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
