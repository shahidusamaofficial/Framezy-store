-- Run this if you already ran schema.sql before and just need to add the
-- new Contact Us table. If you're running schema.sql fresh, skip this file
-- (it's already included there).

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

create policy "Public can insert contact messages" on contact_messages for insert with check (true);
