-- Migration 3: Create indexes for query performance
-- Run after migration 2 (tables must exist first)

-- bookings: most queries filter by date
create index bookings_booking_date_idx on bookings(booking_date);

-- bookings: admin views filter by status
create index bookings_status_idx on bookings(status);

-- bookings: webhook lookup by stripe session (partial — only non-null rows)
create index bookings_stripe_session_id_idx on bookings(stripe_session_id)
  where stripe_session_id is not null;

-- bookings: join to services
create index bookings_service_id_idx on bookings(service_id);

-- services: listing page only shows active services
create index services_active_idx on services(active);

-- weekly_availability: slot generation filters by day of week
create index weekly_availability_day_idx on weekly_availability(day_of_week);

-- blocked_dates: availability check filters by date
create index blocked_dates_date_idx on blocked_dates(date);
