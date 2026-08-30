-- Rate limiting for the two public endpoints.
--
-- /api/stripe/checkout creates a database row and a Stripe session on every
-- call, with no limit. A trivial script can hold every slot for thirty minutes
-- at a time; the sweeper now releases those, but it runs hourly, so a
-- determined caller still keeps the calendar full.
--
-- The counter lives in Postgres rather than in process memory because the app
-- runs serverless: instances come and go and do not share state, so an
-- in-memory limiter would reset whenever a request landed on a cold one — a
-- limit that looks like protection without being any.

begin;

create table if not exists rate_limits (
  bucket       text        not null,
  window_start timestamptz not null,
  count        integer     not null default 0,
  primary key (bucket, window_start)
);

-- Only ever queried by primary key; this index is for the sweep below.
create index if not exists rate_limits_window_idx on rate_limits (window_start);

/**
 * Records one hit and returns the running total for the window.
 *
 * The insert-or-increment has to be atomic: a read-then-write from the
 * application would let concurrent requests each read the same count and
 * collectively blow past the limit, which is precisely the traffic a limiter
 * exists to stop.
 */
create or replace function bump_rate_limit(
  p_bucket       text,
  p_window_start timestamptz
)
returns integer
language sql
as $$
  insert into rate_limits (bucket, window_start, count)
  values (p_bucket, p_window_start, 1)
  on conflict (bucket, window_start)
    do update set count = rate_limits.count + 1
  returning count;
$$;

/** Drops windows that can no longer be consulted. Called by the hourly sweeper. */
create or replace function prune_rate_limits(p_older_than timestamptz)
returns integer
language plpgsql
as $$
declare
  removed integer;
begin
  delete from rate_limits where window_start < p_older_than;
  get diagnostics removed = row_count;
  return removed;
end;
$$;

-- Written and read only with the service-role key, which bypasses RLS. Enabled
-- with no policy so that an anon client cannot read or forge counters.
alter table rate_limits enable row level security;

commit;
