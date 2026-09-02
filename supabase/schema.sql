-- Framezy — Supabase schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query).

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  blurb text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_slug text references categories(slug),
  panels int default 1,
  price numeric not null,
  compare_at numeric,
  image text,
  sizes text[],
  description text,
  is_custom boolean default false,
  rating numeric default 0,
  reviews int default 0,
  created_at timestamptz default now()
);

create table if not exists bundles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  product_ids uuid[],
  price numeric not null,
  compare_at numeric,
  image text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  payment_method text default 'cod',
  items jsonb not null,
  subtotal numeric not null,
  shipping numeric not null default 0,
  total numeric not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Row Level Security -------------------------------------------------------
alter table categories enable row level security;
alter table products enable row level security;
alter table bundles enable row level security;
alter table orders enable row level security;

-- Anyone (anon key) can read the catalog.
create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read bundles" on bundles for select using (true);

-- Anyone can create an order (checkout is public), but only you (via the
-- Supabase dashboard / service role) can read or update orders. Adjust this
-- once you build an admin panel with authenticated staff accounts.
create policy "Public can insert orders" on orders for insert with check (true);

-- Seed categories -----------------------------------------------------------
insert into categories (slug, name, blurb) values
  ('islamic', 'Islamic', 'Calligraphy & ayah sets for a home that feels grounded.'),
  ('abstract', 'Abstract', 'Bold shapes and texture for statement walls.'),
  ('typography', 'Typography', 'Word-first pieces for minimal, quote-led spaces.'),
  ('floral', 'Floral', 'Botanical linework in warm, gallery tones.'),
  ('animal', 'Animal & Horse', 'Equestrian and wildlife pieces with real presence.'),
  ('girlish', 'Girlish', 'Soft, feminine sets for bedrooms and vanities.'),
  ('kids', 'Kids Room', 'Playful, nursery-safe prints.'),
  ('panel-sets', 'Multi-Panel Sets', '2 to 10-panel gallery walls, framed and ready.'),
  ('custom', 'Custom Frames', 'Your own photos, names & nikkah dates — framed.')
on conflict (slug) do nothing;

-- Tip: once this schema is live, export lib/products.js into INSERT
-- statements (or a small script) to seed `products` and `bundles`, then
-- swap the frontend to fetch from Supabase instead of the static file.
