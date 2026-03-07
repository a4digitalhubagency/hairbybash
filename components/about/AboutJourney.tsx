// components/about/AboutJourney.tsx
'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const viewport = { once: true, margin: '-60px' } as const

const milestones = [
  {
    icon: '✦',
    year: 'The Beginning',
    title: 'Passion Ignited',
    description: "Bash's love for braiding and hair artistry began early — turning a natural gift into dedicated craft, mastering techniques through hands-on experience and relentless practice.",
  },
  {
    icon: '✦',
    year: 'St. John\'s, NL',
    title: 'HairbyBash Is Born',
    description: 'HairbyBash launched in St. John\'s, Newfoundland — introducing signature protective styles and building a loyal clientele through precision, care, and a deeply personal touch.',
  },
  {
    icon: '✦',
    year: 'Calgary, AB · 2023',
    title: 'Expanding the Crown',
    description: 'Bringing the HairbyBash experience to Calgary — a private, premium studio offering world-class braiding and loc services to a new community of clients.',
  },
]

export default function AboutJourney() {
  return (
    <section className="py-24 px-6 bg-dark-surface/30">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px bg-gold w-6" />
            <span className="text-gold text-[11px] tracking-[0.3em] uppercase font-medium">The Path</span>
            <div className="h-px bg-gold w-6" />
          </div>
          <h2 className="font-(family-name:--font-playfair) font-bold text-4xl md:text-5xl text-white">
            My Journey
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="grid md:grid-cols-3 gap-6">
          {milestones.map((m, i) => (
            <motion.div
              key={m.title}
              className="relative bg-dark-card border border-white/6 rounded-2xl p-7 hover:border-gold/30 transition-colors duration-300 group"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, delay: i * 0.12, ease }}
            >
              {/* Step number */}
              <div className="absolute -top-3 left-6 bg-dark-card border border-gold/25 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-gold text-[10px] font-bold">{i + 1}</span>
              </div>

              {/* Icon */}
              <div className="w-9 h-9 rounded-full bg-gold/8 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold/15 transition-colors duration-300">
                <span className="text-gold text-xs">{m.icon}</span>
              </div>

              {/* Year badge */}
              <p className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">{m.year}</p>

              {/* Title */}
              <h3 className="font-(family-name:--font-playfair) font-semibold text-lg text-white mb-3 leading-snug">
                {m.title}
              </h3>

              {/* Body */}
              <p className="text-white/45 text-sm leading-[1.75]">
                {m.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
