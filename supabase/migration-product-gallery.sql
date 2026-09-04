-- Run this if you already ran schema.sql before and just need to add the
-- new product gallery/features columns. If you're running schema.sql fresh,
-- skip this file (it's already included there).

alter table products add column if not exists images text[];
alter table products add column if not exists features text[];
