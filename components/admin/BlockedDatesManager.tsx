'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { BlockedDate } from '@/types'
import Toast from '@/components/ui/Toast'
import type { ToastMessage } from '@/components/ui/Toast'

const REASON_MAX = 200

interface BlockedDatesManagerProps {
  initialDates: BlockedDate[]
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function BlockedDatesManager({ initialDates }: BlockedDatesManagerProps) {
  const router = useRouter()
  const [dates, setDates] = useState<BlockedDate[]>(initialDates)
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)   // two-step delete
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Sync when server re-fetches after router.refresh()
  useEffect(() => {
    setDates(initialDates)
  }, [initialDates])

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Min date = today (local, not UTC)
  const _d = new Date()
  const today = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, '0')}-${String(_d.getDate()).padStart(2, '0')}`

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault()
    if (!date || submitting) return

    // ── Client-side duplicate check ─────────────────────────────────────────
    if (dates.some((d) => d.date === date)) {
      addToast('This date is already blocked.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, reason: reason.trim() || null }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to block date.')
      }

      const { blockedDate, conflicts } = await res.json()
      setDates((prev) => [...prev, blockedDate].sort((a, b) => a.date.localeCompare(b.date)))
      setDate('')
      setReason('')

      if (conflicts > 0) {
        // Date blocked, but warn about existing bookings
        addToast(
          `${fmtDate(blockedDate.date)} blocked. ⚠ ${conflicts} existing booking${conflicts > 1 ? 's' : ''} still active on this date.`,
          'success',
        )
      } else {
        addToast(`${fmtDate(blockedDate.date)} blocked.`, 'success')
      }
      router.refresh()
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to block date.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string, dateStr: string) {
    if (deletingId) return
    setDeletingId(id)
    setConfirmId(null)
    try {
      const res = await fetch(`/api/admin/blocked-dates/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? 'Failed to remove blocked date.')
      }

      setDates((prev) => prev.filter((d) => d.id !== id))
      addToast(`${fmtDate(dateStr)} unblocked.`, 'success')
      router.refresh()
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to remove blocked date.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const reasonLen = reason.length

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="bg-dark-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-semibold text-white">Blocked Dates</h2>
          <p className="text-gray-500 text-xs mt-0.5">Dates when the studio is closed — no new bookings accepted</p>
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
              className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 scheme-dark"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-40">
            <div className="flex items-center justify-between">
              <label className="text-gray-500 text-xs">Reason (optional)</label>
              {reasonLen > 0 && (
                <span className={`text-[10px] tabular-nums ${reasonLen >= REASON_MAX ? 'text-red-400' : 'text-white/25'}`}>
                  {reasonLen}/{REASON_MAX}
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. Vacation"
              value={reason}
              maxLength={REASON_MAX}
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
              <li key={d.id} className="px-6 py-3 flex items-center justify-between gap-4 hover:bg-white/2">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium">{fmtDate(d.date)}</p>
                  {d.reason && <p className="text-gray-500 text-xs truncate">{d.reason}</p>}
                </div>

                {/* Two-step inline confirm */}
                {confirmId === d.id ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-white/40 text-xs">Unblock?</span>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(d.id, d.date)}
                      disabled={deletingId === d.id}
                      className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-semibold transition-colors disabled:opacity-40"
                    >
                      {deletingId === d.id ? '…' : 'Unblock'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(d.id)}
                    disabled={!!deletingId}
                    className="shrink-0 w-6 h-6 rounded-full text-gray-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors disabled:opacity-40"
                    title="Unblock date"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
