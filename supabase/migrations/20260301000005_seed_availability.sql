-- Migration 5: Seed default weekly availability
-- Mon–Sat, 9AM–6PM. Sunday omitted = closed.
-- Adjust these times in Supabase Table Editor later if needed.

insert into weekly_availability (day_of_week, start_time, end_time) values
  (1, '09:00', '18:00'),  -- Monday
  (2, '09:00', '18:00'),  -- Tuesday
  (3, '09:00', '18:00'),  -- Wednesday
  (4, '09:00', '18:00'),  -- Thursday
  (5, '09:00', '18:00'),  -- Friday
  (6, '09:00', '18:00');  -- Saturday
