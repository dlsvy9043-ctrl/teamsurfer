create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_normalized text generated always as (lower(trim(name))) stored,
  phone text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  role text not null default 'user',
  requested_at timestamptz default now(),
  approved_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create unique index if not exists users_name_normalized_uq on public.users (name_normalized);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists users_touch_updated_at on public.users;
create trigger users_touch_updated_at
before update on public.users
for each row
execute function public.touch_updated_at();

insert into public.users (
  name,
  phone,
  status,
  role,
  requested_at,
  approved_at
) values (
  'ghddlsvy7734',
  '관리자 계정',
  'approved',
  'admin',
  now(),
  now()
) on conflict (name_normalized) do nothing;
