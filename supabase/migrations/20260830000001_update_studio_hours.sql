-- Studio hours corrected to 08:00–21:00, seven days.
--
-- Confirmed with Bash: she opens at 8am, and every appointment must end by 9pm.
-- That single rule is the whole booking policy — she will start a 90-minute
-- style at 19:00 and a 3-hour style at 18:00, so no separate evening rule is
-- needed. The slot loop in lib/availability.ts already enforces it via
-- `start + duration <= closeMin`.
--
-- Supersedes the 09:00–18:00 values in 20260301000005_seed_availability.sql
-- and 20260302000001_add_sunday_availability.sql, which were never correct.
--
-- Consequence: the bookable window becomes 780 minutes, so the longest
-- bookable service is 13 hours. LOE v1.2 asks for a 14-hour ceiling; a service
-- set above 780 will be recordable but never offered to clients.

update weekly_availability
set start_time = '08:00',
    end_time   = '21:00';
