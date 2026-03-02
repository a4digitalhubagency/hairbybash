'use client'

import { motion } from 'framer-motion'

export type BookingStep = 'service' | 'datetime' | 'details' | 'review'

const STEPS: Array<{ key: BookingStep; label: string }> = [
  { key: 'service', label: 'Service' },
  { key: 'datetime', label: 'Date & Time' },
  { key: 'details', label: 'Details' },
  { key: 'review', label: 'Review' },
]

const STEP_ORDER: BookingStep[] = ['service', 'datetime', 'details', 'review']

interface StepIndicatorProps {
  currentStep: BookingStep
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep)

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex
        const isActive = i === currentIndex

        return (
          <div key={step.key} className="flex items-center">
            {/* Step node */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Background circle */}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? 'bg-gold border-gold'
                      : isActive
                        ? 'bg-transparent border-gold'
                        : 'bg-transparent border-white/20'
                  }`}
                >
                  {isDone ? (
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span
                      className={`text-xs font-semibold ${
                        isActive ? 'text-gold' : 'text-white/30'
                      }`}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Active pulse ring */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-gold/40"
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                  isDone || isActive ? 'text-white/70' : 'text-white/25'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="relative w-16 md:w-24 h-px mx-2 mb-5 bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gold"
                  initial={{ width: isDone ? '100%' : '0%' }}
                  animate={{ width: isDone ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
