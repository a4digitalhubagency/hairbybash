// components/contact/ContactInfo.tsx
'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const viewport = { once: true, margin: '-60px' } as const

export default function ContactInfo() {
  return (
    <section className="py-20 px-6 bg-dark">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease }}
            className="bg-dark-card border border-white/8 rounded-2xl p-8"
          >
            <p className="text-gold text-xs tracking-[0.25em] uppercase font-medium mb-6">
              Location
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-white/70 text-sm leading-relaxed">Calgary, Alberta</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span className="text-white/70 text-sm leading-relaxed">
                  Private studio — address provided at booking
                </span>
              </li>
            </ul>

            <p className="mt-6 text-white/35 text-xs italic leading-relaxed">
              All appointments are held in a calm, private setting designed for your comfort.
            </p>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease }}
            className="bg-dark-card border border-white/8 rounded-2xl p-8"
          >
            <p className="text-gold text-xs tracking-[0.25em] uppercase font-medium mb-6">
              Hours
            </p>

            <ul className="space-y-3">
              {[
                { days: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
                { days: 'Saturday – Sunday', hours: '9:00 AM – 6:00 PM' },
              ].map(({ days, hours }) => (
                <li key={days} className="flex items-center justify-between gap-4">
                  <span className="text-white/60 text-sm">{days}</span>
                  <span className="text-white/90 text-sm font-medium tabular-nums">{hours}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-white/6">
              <p className="text-white/35 text-xs leading-relaxed">
                Hours may vary on public holidays. Check Instagram for updates.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
