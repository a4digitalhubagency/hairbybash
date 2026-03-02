'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Booking, BookingStatus } from '@/types'
import { formatPrice, formatDateShort, formatTime, formatDuration } from '@/lib/format'
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

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  async function updateStatus(id: string, status: 'confirmed' | 'cancelled') {
    const prev = bookings.find((b) => b.id === id)
    if (!prev) return

    // Optimistic update
    setLoadingId(id)
    setBookings((bs) => bs.map((b) => b.id === id ? { ...b, status } : b))

    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    setLoadingId(null)

    if (!res.ok) {
      // Revert
      setBookings((bs) => bs.map((b) => b.id === id ? { ...b, status: prev.status } : b))
      addToast('Failed to update booking. Please try again.', 'error')
    } else {
      const verb = status === 'confirmed' ? 'Confirmed' : 'Cancelled'
      addToast(`${verb} ${prev.client_name}'s booking.`, 'success')
      router.refresh()
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

      <div className="bg-dark-card rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <h2 className="font-semibold text-white">Upcoming Appointments</h2>
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
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            disabled={loadingId === booking.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Confirm
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, 'cancelled')}
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
                          onClick={() => updateStatus(booking.id, 'cancelled')}
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
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              disabled={loadingId === booking.id}
                              title="Confirm"
                              className="w-7 h-7 rounded-full bg-green-500/15 text-green-400 hover:bg-green-500/30 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => updateStatus(booking.id, 'cancelled')}
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
                            onClick={() => updateStatus(booking.id, 'cancelled')}
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
