import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/format'
import StatCard from '@/components/admin/StatCard'
import BookingsTable from '@/components/admin/BookingsTable'
import BlockedDatesManager from '@/components/admin/BlockedDatesManager'
import type { Booking, BlockedDate } from '@/types'

const PAGE_SIZE = 10

// ── Icons ──────────────────────────────────────────────────────────────────
function RevenueIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
    </svg>
  )
}

function ClientsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function PendingIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function TodayIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const filter = (params.filter ?? 'upcoming') as 'upcoming' | 'all'

  const admin = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)

  // ── Parallel fetch everything ────────────────────────────────────────────
  const [pendingRes, todayRes, confirmedRes, revenueRes, bookingsRes, blockedRes] =
    await Promise.all([
      // Pending count
      admin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),

      // Today's count (non-cancelled)
      admin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('booking_date', today)
        .neq('status', 'cancelled'),

      // Total confirmed count
      admin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'confirmed'),

      // Revenue: price of all confirmed bookings (via joined service)
      admin
        .from('bookings')
        .select('service:services(price)')
        .eq('status', 'confirmed'),

      // Paginated bookings list
      (() => {
        let q = admin
          .from('bookings')
          .select('*, service:services(*)', { count: 'exact' })
          .order('booking_date', { ascending: true })
          .order('start_time', { ascending: true })
          .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

        if (filter === 'upcoming') {
          q = q.gte('booking_date', today).neq('status', 'cancelled')
        }
        return q
      })(),

      // Blocked dates
      admin
        .from('blocked_dates')
        .select('*')
        .order('date', { ascending: true }),
    ])

  // ── Compute stats ────────────────────────────────────────────────────────
  const pendingCount = pendingRes.count ?? 0
  const todayCount = todayRes.count ?? 0
  const confirmedCount = confirmedRes.count ?? 0

  const totalRevenueCents = (revenueRes.data ?? []).reduce((sum, row) => {
    const price = (row.service as { price?: number } | null)?.price ?? 0
    return sum + price
  }, 0)

  const bookings = (bookingsRes.data ?? []) as Booking[]
  const total = bookingsRes.count ?? 0
  const blockedDates = (blockedRes.data ?? []) as BlockedDate[]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<RevenueIcon />}
          label="Total Revenue"
          value={formatPrice(totalRevenueCents)}
          subtitle="From confirmed bookings"
        />
        <StatCard
          icon={<TodayIcon />}
          label="Today's Appointments"
          value={todayCount}
          subtitle={todayCount === 1 ? '1 appointment today' : `${todayCount} appointments today`}
        />
        <StatCard
          icon={<ClientsIcon />}
          label="Confirmed Bookings"
          value={confirmedCount}
          subtitle="All time"
        />
        <StatCard
          icon={<PendingIcon />}
          label="Pending Requests"
          value={pendingCount}
          subtitle={pendingCount > 0 ? 'Awaiting your confirmation' : 'All caught up!'}
        />
      </div>

      {/* Bookings table */}
      <BookingsTable
        bookings={bookings}
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        filter={filter}
      />

      {/* Blocked dates */}
      <BlockedDatesManager initialDates={blockedDates} />
    </div>
  )
}
