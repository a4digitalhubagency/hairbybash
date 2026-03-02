-- Add Sunday (day_of_week = 0) to weekly availability
-- Studio is open 7 days a week, 9AM–6PM
insert into weekly_availability (day_of_week, start_time, end_time)
values (0, '09:00', '18:00');
