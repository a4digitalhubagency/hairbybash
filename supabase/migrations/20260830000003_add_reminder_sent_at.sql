-- LOE v1.2 §4 — 24-hour reminder emails.
--
-- Records when a reminder went out so a re-run cannot send a second one.
-- Scheduled jobs are retried and can overlap, so "did we already do this?" has
-- to live in the database rather than in the scheduler.
--
-- Null means no reminder has been sent. The conditional update in the cron
-- handler claims the row by setting this, exactly as the Stripe webhook claims
-- a booking with .eq('status','pending').

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz;

-- The reminder job only ever looks for confirmed bookings on a given date that
-- have not been reminded. Partial index keeps that scan tiny as the table grows.
CREATE INDEX IF NOT EXISTS bookings_reminder_pending_idx
  ON bookings (booking_date, start_time)
  WHERE reminder_sent_at IS NULL AND status = 'confirmed';

-- The sweeper looks for stale pending bookings by age.
CREATE INDEX IF NOT EXISTS bookings_pending_created_idx
  ON bookings (created_at)
  WHERE status = 'pending';
