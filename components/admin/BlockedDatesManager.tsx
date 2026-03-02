'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { BlockedDate } from '@/types'
import Toast from '@/components/ui/Toast'
import type { ToastMessage } from '@/components/ui/Toast'

interface BlockedDatesManagerProps {
  initialDates: BlockedDate[]
}

export default function BlockedDatesManager({ initialDates }: BlockedDatesManagerProps) {
  const router = useRouter()
  const [dates, setDates] = useState<BlockedDate[]>(initialDates)
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault()
    if (!date) return

    setSubmitting(true)
    const res = await fetch('/api/admin/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, reason: reason.trim() || null }),
    })
    setSubmitting(false)

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      addToast(body.error ?? 'Failed to block date.', 'error')
      return
    }

    const { blockedDate } = await res.json()
    setDates((prev) => [...prev, blockedDate].sort((a, b) => a.date.localeCompare(b.date)))
    setDate('')
    setReason('')
    addToast(`${date} has been blocked.`, 'success')
    router.refresh()
  }

  async function handleDelete(id: string, dateStr: string) {
    setDeletingId(id)
    const res = await fetch(`/api/admin/blocked-dates/${id}`, { method: 'DELETE' })
    setDeletingId(null)

    if (!res.ok) {
      addToast('Failed to remove blocked date.', 'error')
      return
    }

    setDates((prev) => prev.filter((d) => d.id !== id))
    addToast(`${dateStr} unblocked.`, 'success')
    router.refresh()
  }

  // Min date = today
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="bg-dark-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-semibold text-white">Blocked Dates</h2>
          <p className="text-gray-500 text-xs mt-0.5">Dates when the studio is closed (no bookings accepted)</p>
        </div>

        {/* Add form */}
        <form onSubmit={handleBlock} className="px-6 py-4 border-b border-white/8 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-xs">Date</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 [color-scheme:dark]"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
            <label className="text-gray-500 text-xs">Reason (optional)</label>
            <input
              type="text"
              placeholder="e.g. Vacation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/50"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !date}
            className="px-4 py-2 bg-gold text-black rounded-lg text-sm font-semibold hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Blocking…' : 'Block Date'}
          </button>
        </form>

        {/* List */}
        {dates.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500 text-sm">No blocked dates.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {dates.map((d) => (
              <li key={d.id} className="px-6 py-3 flex items-center justify-between hover:bg-white/[0.02]">
                <div>
                  <p className="text-white text-sm font-medium">{d.date}</p>
                  {d.reason && <p className="text-gray-500 text-xs">{d.reason}</p>}
                </div>
                <button
                  onClick={() => handleDelete(d.id, d.date)}
                  disabled={deletingId === d.id}
                  className="w-6 h-6 rounded-full text-gray-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors disabled:opacity-40"
                  title="Unblock"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
