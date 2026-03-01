-- Migration 1: Create custom enum types
-- Run this first in Supabase SQL Editor

create type booking_status as enum ('pending', 'confirmed', 'cancelled');
create type payment_status as enum ('unpaid', 'paid', 'refunded');
