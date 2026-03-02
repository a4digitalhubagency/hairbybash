'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export type ToastType = 'error' | 'success' | 'info'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

const ICONS: Record<ToastType, React.ReactNode> = {
  error: (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  success: (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
}

const STYLES: Record<ToastType, string> = {
  error:   'bg-[#1a0a0a] border-red-500/40 text-red-300',
  success: 'bg-[#0a1a0d] border-green-500/40 text-green-300',
  info:    'bg-dark-card border-white/15 text-white/80',
}

const AUTO_DISMISS_MS: Record<ToastType, number> = {
  error:   6000,
  success: 4000,
  info:    4000,
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage
  onDismiss: (id: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(
      () => onDismiss(toast.id),
      AUTO_DISMISS_MS[toast.type],
    )
    return () => clearTimeout(timer)
  }, [toast.id, toast.type, onDismiss])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-sm max-w-sm w-full ${STYLES[toast.type]}`}
    >
      <span className="mt-0.5">{ICONS[toast.type]}</span>
      <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
