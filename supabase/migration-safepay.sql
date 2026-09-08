-- The `orders` table already has a free-text `status` column (default
-- 'pending'), so no schema change is strictly required for Safepay to
-- work — the webhook just writes 'paid' or 'payment_failed' into it.
--
-- This migration only adds an index to make looking up orders by id
-- faster for the webhook (harmless if you skip it — id is already the
-- primary key, so lookups work fine either way, this just speeds them up
-- slightly as your order volume grows).

create index if not exists idx_orders_id_lookup on orders (id);
