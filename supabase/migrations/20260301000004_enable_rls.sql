-- Migration 4: Enable Row Level Security and define policies
-- Run after migration 2 (tables must exist first)

alter table services            enable row level security;
alter table bookings            enable row level security;
alter table weekly_availability enable row level security;
alter table blocked_dates       enable row level security;

-- Public can read active services (services listing page)
create policy "Public read active services"
  on services for select
  using (active = true);

-- Public can read weekly availability (needed for booking flow slot generation)
create policy "Public read weekly availability"
  on weekly_availability for select
  using (true);

-- Public can read blocked dates (needed for booking flow date picker)
create policy "Public read blocked dates"
  on blocked_dates for select
  using (true);

-- bookings: NO public read policy intentionally omitted
-- All booking writes come via SUPABASE_SERVICE_ROLE_KEY (webhooks/API routes)
-- which bypasses RLS entirely — no policy needed for server-side operations
