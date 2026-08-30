'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Booking, BookingStatus } from '@/types'
import { formatPrice, formatDateShort, formatTime, formatDuration, formatDate, calculateDeposit } from '@/lib/format'
import Toast from '@/components/ui/Toast'
import type { ToastMessage } from '@/components/ui/Toast'

interface BookingsTableProps {
  bookings: Booking[]
  page: number
  total: number
  pageSize: number
  filter: 'upcoming' | 'all'
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending:   'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  confirmed: 'bg-green-500/15 text-green-400 border border-green-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

// ── Booking Detail Modal ───────────────────────────────────────────────────────
interface ModalProps {
  booking: Booking
  action: 'confirmed' | 'cancelled'
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}

function BookingActionModal({ booking, action, loading, onConfirm, onClose }: ModalProps) {
  const deposit = booking.service
    ? calculateDeposit(booking.service.price, booking.service.deposit_percentage)
    : null

  const isConfirm = action === 'confirmed'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-dark-card border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <h3 className="text-white font-semibold text-base">
            {isConfirm ? 'Confirm Booking' : 'Cancel Booking'}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Client */}
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Client</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-semibold shrink-0">
                {getInitials(booking.client_name)}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{booking.client_name}</p>
                <p className="text-white/50 text-xs">{booking.client_email}</p>
                <p className="text-white/50 text-xs">{booking.client_phone}</p>
              </div>
            </div>
          </div>

          {/* Appointment */}
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Appointment</p>
            <div className="bg-dark-surface rounded-xl px-4 py-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">Service</span>
                <span className="text-white text-xs font-medium">{booking.service?.name ?? '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">Category</span>
                <span className="text-white text-xs">{booking.service?.category ?? '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">Duration</span>
                <span className="text-white text-xs">
                  {booking.service ? formatDuration(booking.service.duration_minutes) : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">Date</span>
                <span className="text-white text-xs">{formatDate(booking.booking_date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">Time</span>
                <span className="text-white text-xs">
                  {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-2">
                <span className="text-white/50 text-xs">Blow Dry Service</span>
                <span className={`text-xs font-medium ${booking.blow_dry_requested ? 'text-gold' : 'text-white/60'}`}>
                  {booking.blow_dry_requested ? 'Requested — charge in person' : 'Arriving ready'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          {deposit && (
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Payment</p>
              <div className="bg-dark-surface rounded-xl px-4 py-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs">Service price</span>
                  <span className="text-white text-xs">{formatPrice(deposit.servicePrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs">
                    Deposit ({booking.service!.deposit_percentage}%)
                  </span>
                  <span className="text-white text-xs">{formatPrice(deposit.depositBase)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs">GST (5%)</span>
                  <span className="text-white text-xs">{formatPrice(deposit.depositGST)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-2">
                  <span className="text-gold text-xs font-semibold">Deposit paid</span>
                  <span className="text-gold text-sm font-bold">{formatPrice(deposit.depositTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-xs">Remainder due on day</span>
                  <span className="text-white/60 text-xs">{formatPrice(deposit.remainder)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Current status */}
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs">Current status</span>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}>
              {booking.status}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-white/8 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white/80 hover:border-white/20 text-sm font-medium transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isConfirm
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                : 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/25'
            }`}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              isConfirm ? 'Yes, Confirm' : 'Yes, Cancel'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Table ─────────────────────────────────────────────────────────────────
export default function BookingsTable({
  bookings: initialBookings,
  page,
  total,
  pageSize,
  filter,
}: BookingsTableProps) {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [pendingAction, setPendingAction] = useState<{
    booking: Booking
    status: 'confirmed' | 'cancelled'
  } | null>(null)

  // Sync local state when the server re-fetches after router.refresh()
  useEffect(() => {
    setBookings(initialBookings)
  }, [initialBookings])

  // Auto-refresh every 30s so webhook-confirmed bookings appear without manual reload
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 30_000)
    return () => clearInterval(interval)
  }, [router])

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Opens the modal instead of acting immediately
  function requestAction(booking: Booking, status: 'confirmed' | 'cancelled') {
    setPendingAction({ booking, status })
  }

  async function confirmAction() {
    if (!pendingAction || loadingId) return
    const { booking, status } = pendingAction

    setLoadingId(booking.id)
    setBookings((bs) => bs.map((b) => b.id === booking.id ? { ...b, status } : b))

    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? 'Failed to update booking')
      }

      const verb = status === 'confirmed' ? 'Confirmed' : 'Cancelled'
      addToast(`${verb} ${booking.client_name}'s booking.`, 'success')
      setPendingAction(null)
      router.refresh()
    } catch (err) {
      // Revert on failure
      setBookings((bs) => bs.map((b) => b.id === booking.id ? { ...b, status: booking.status } : b))
      addToast(err instanceof Error ? err.message : 'Failed to update booking. Please try again.', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  function goToPage(p: number) {
    const params = new URLSearchParams({ page: String(p), filter })
    router.push(`/admin/dashboard?${params.toString()}`)
  }

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {pendingAction && (
        <BookingActionModal
          booking={pendingAction.booking}
          action={pendingAction.status}
          loading={loadingId === pendingAction.booking.id}
          onConfirm={confirmAction}
          onClose={() => setPendingAction(null)}
        />
      )}

      <div className="bg-dark-card rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <h2 className="font-semibold text-white">
            {filter === 'all' ? 'All Appointments' : 'Upcoming Appointments'}
          </h2>
          {total > 0 && (
            <span className="text-gray-500 text-sm">
              Showing {start}–{end} of {total}
            </span>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-500">
            No appointments found.
          </div>
        ) : (
          <>
            {/* ── Mobile cards (< sm) ──────────────────────────────────────── */}
            <ul className="sm:hidden divide-y divide-white/5">
              {bookings.map((booking) => (
                <li key={booking.id} className="px-4 py-4 space-y-3">
                  {/* Row 1: avatar + name + status */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-semibold shrink-0">
                      {getInitials(booking.client_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{booking.client_name}</p>
                      <p className="text-gray-500 text-xs truncate">{booking.client_email}</p>
                    </div>
                    <span className={`inline-flex shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Row 2: service + date */}
                  <div className="flex items-start gap-2 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-white truncate">
                        {booking.service?.name ?? '—'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {booking.service ? formatDuration(booking.service.duration_minutes) : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white">{formatDateShort(booking.booking_date)}</p>
                      <p className="text-gray-500 text-xs">
                        {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                      </p>
                    </div>
                  </div>

                  {/* Row 3: price + actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-semibold text-sm">
                      {booking.service ? formatPrice(booking.service.price) : '—'}
                    </span>
                    <div className="flex items-center gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => requestAction(booking, 'confirmed')}
                            disabled={loadingId === booking.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Confirm
                          </button>
                          <button
                            onClick={() => requestAction(booking, 'cancelled')}
                            disabled={loadingId === booking.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => requestAction(booking, 'cancelled')}
                          disabled={loadingId === booking.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* ── Desktop table (sm+) ──────────────────────────────────────── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="px-6 py-3 text-left font-medium">Client</th>
                    <th className="px-6 py-3 text-left font-medium">Service</th>
                    <th className="px-6 py-3 text-left font-medium">Date & Time</th>
                    <th className="px-6 py-3 text-left font-medium">Price</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/2 transition-colors">
                      {/* Client */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-semibold shrink-0">
                            {getInitials(booking.client_name)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{booking.client_name}</p>
                            <p className="text-gray-500 text-xs">{booking.client_email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-6 py-4">
                        {booking.service ? (
                          <div>
                            <p className="text-white">{booking.service.name}</p>
                            <p className="text-gray-500 text-xs">{formatDuration(booking.service.duration_minutes)}</p>
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4">
                        <p className="text-white">{formatDateShort(booking.booking_date)}</p>
                        <p className="text-gray-500 text-xs">
                          {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-white">
                        {booking.service ? formatPrice(booking.service.price) : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}>
                          {booking.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        {booking.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => requestAction(booking, 'confirmed')}
                              disabled={loadingId === booking.id}
                              title="Confirm"
                              className="w-7 h-7 rounded-full bg-green-500/15 text-green-400 hover:bg-green-500/30 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => requestAction(booking, 'cancelled')}
                              disabled={loadingId === booking.id}
                              title="Cancel"
                              className="w-7 h-7 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/25 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => requestAction(booking, 'cancelled')}
                            disabled={loadingId === booking.id}
                            title="Cancel booking"
                            className="w-7 h-7 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/25 flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        {booking.status === 'cancelled' && (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Previous
            </button>
            <span className="text-gray-500 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  )
}
