// components/about/AboutJourney.tsx - CORRECTED
'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const viewport = { once: true, margin: '-80px' } as const

const milestones = [
  {
    icon: '✦',
    title: 'London Training',
    description: 'Professional training at Vidal Sassoon and apprenticeship at luxury salons in Mayfair.',
    year: '2012-2014',
  },
  {
    icon: '✦',
    title: 'Boutique Launch',
    description: 'HairbyBash began its journey in St. John’s, Newfoundland, where we first introduced our signature styling techniques. In 2023, we expanded our footprint, bringing our premium hair care services to the vibrant community of Calgary, Alberta',
    year: '2016',
  },
  {
    icon: '✦',
    title: 'Master Artistry',
    description: 'Recognized as a leading educator and stylist, training the next generation of hair artists.',
    year: 'Present',
  },
]

export default function AboutJourney() {
  return (
    <section className="py-20 px-6 bg-dark">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className="font-(family-name:--font-playfair) font-bold text-3xl md:text-4xl text-white">
            My Journey
          </h2>
        </motion.div>

        {/* Timeline Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {milestones.map((milestone, i) => (
            <motion.div
              key={milestone.title}
              className="group bg-dark-card border border-white/8 rounded-2xl p-6 hover:bg-gold transition-colors duration-2000 ease-in"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 group-hover:bg-black/10 group-hover:border-black/20 flex items-center justify-center mb-4 transition-colors duration-2000 ease-in">
                <span className="text-gold group-hover:text-black text-sm transition-colors duration-2000 ease-in">{milestone.icon}</span>
              </div>

              {/* Content */}
              <h3 className="font-(family-name:--font-playfair) font-semibold text-xl text-white group-hover:text-black mb-3 transition-colors duration-2000 ease-in">
                {milestone.title}
              </h3>
              <p className="text-white/50 group-hover:text-black/60 text-sm leading-relaxed mb-4 transition-colors duration-2000 ease-in">
                {milestone.description}
              </p>

              {/* Year */}
              <p className="text-gold group-hover:text-black text-xs tracking-wider uppercase transition-colors duration-2000 ease-in">
                {milestone.year}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}