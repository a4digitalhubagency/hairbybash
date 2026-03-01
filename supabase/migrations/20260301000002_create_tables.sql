-- Migration 2: Create all tables
-- Run after migration 1 (enums must exist first)

create table services (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  description         text not null,
  price               integer not null,           -- stored in cents
  deposit_percentage  integer not null default 20,
  duration_minutes    integer not null,
  category            text not null,
  image_url           text,
  active              boolean not null default true,
  created_at          timestamptz not null default now()
);

create table bookings (
  id                uuid primary key default gen_random_uuid(),
  service_id        uuid not null references services(id) on delete restrict,
  client_name       text not null,
  client_email      text not null,
  client_phone      text not null,
  booking_date      date not null,
  start_time        time not null,
  end_time          time not null,
  status            booking_status not null default 'pending',
  payment_status    payment_status not null default 'unpaid',
  stripe_session_id text,
  created_at        timestamptz not null default now()
);

create table weekly_availability (
  id           uuid primary key default gen_random_uuid(),
  day_of_week  integer not null check (day_of_week >= 0 and day_of_week <= 6),
  start_time   time not null,
  end_time     time not null
);

create table blocked_dates (
  id      uuid primary key default gen_random_uuid(),
  date    date not null unique,
  reason  text
);
