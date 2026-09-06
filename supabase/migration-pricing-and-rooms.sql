-- Run this if you already ran schema.sql before and just need these two
-- new columns. If you're running schema.sql fresh, skip this file (it's
-- already included there). Both are nullable and non-breaking — existing
-- products keep working exactly as before until you fill them in.

alter table products add column if not exists size_prices jsonb;
alter table products add column if not exists room_slug text;
