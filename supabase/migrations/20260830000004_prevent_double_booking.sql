-- Prevent two clients holding the same slot.
--
-- Checkout re-checks availability before inserting, which narrows the race but
-- cannot close it: it is a read followed by a write, with no transaction and
-- nothing in the database enforcing the invariant. Two requests milliseconds
-- apart both see the slot free and both insert, and the studio finds out on the
-- day.
--
-- An exclusion constraint moves the rule to the only place that can enforce it
-- under concurrency. The second insert fails with SQLSTATE 23P01, which the
-- checkout route maps to the 409 the booking flow already handles — the client
-- is sent back to pick another time, exactly as when a slot is taken normally.
--
-- Scope note: this forbids genuine overlap only. The one-hour buffer between
-- appointments is a business preference applied when offering slots, not a
-- correctness invariant — back-to-back bookings are valid data even though the
-- booking flow will not propose them.
--
-- Verified against live data before writing: 6 non-cancelled bookings, no
-- overlapping pairs, so the constraint applies without conflict.

begin;

-- Needed to mix an equality column with a range column in one GiST index.
create extension if not exists btree_gist;

-- Postgres ships range types for dates and timestamps but not for time, and
-- start_time/end_time are naive local times.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'timerange') then
    create type timerange as range (subtype = time);
  end if;
end $$;

alter table bookings
  add constraint bookings_no_overlapping_slots
  exclude using gist (
    booking_date with =,
    timerange(start_time, end_time) with &&
  )
  -- Cancelled bookings release their slot, so they must not block a rebooking.
  -- Pending ones still hold it: the deposit window is exactly when the race
  -- happens, and the sweeper releases them if checkout is abandoned.
  where (status <> 'cancelled');

commit;
