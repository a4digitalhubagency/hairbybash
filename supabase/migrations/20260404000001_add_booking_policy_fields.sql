-- Add blow_dry_requested: client indicates if hair will be detangled & blow dried before appointment.
-- If true, they are charged in person; the system just captures intent.
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS blow_dry_requested boolean NOT NULL DEFAULT false;

-- Add reschedule_used: tracks whether the client has used their one-time reschedule allowance.
-- Policy: one reschedule permitted if requested >48 hours before appointment.
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS reschedule_used boolean NOT NULL DEFAULT false;
