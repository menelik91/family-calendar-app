create extension if not exists "pgcrypto";

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  color text not null default '#BFDBFE',
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null,
  notes text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  category text,
  assigned_member_id uuid references public.family_members(id) on delete set null,
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (ends_at >= starts_at)
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_events_updated_at
before update on public.events
for each row execute procedure public.handle_updated_at();

alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.events enable row level security;

create policy "family members can view their family"
on public.families
for select
using (
  exists (
    select 1 from public.family_members fm
    where fm.family_id = families.id and fm.user_id = auth.uid()
  )
  or created_by = auth.uid()
);

create policy "authenticated users can create family"
on public.families
for insert
with check (auth.uid() = created_by);

create policy "members can view memberships in same family"
on public.family_members
for select
using (
  exists (
    select 1 from public.family_members fm
    where fm.family_id = family_members.family_id and fm.user_id = auth.uid()
  )
);

create policy "authenticated users can join a family"
on public.family_members
for insert
with check (auth.uid() = user_id);

create policy "members can view family events"
on public.events
for select
using (
  exists (
    select 1 from public.family_members fm
    where fm.family_id = events.family_id and fm.user_id = auth.uid()
  )
);

create policy "members can insert family events"
on public.events
for insert
with check (
  auth.uid() = created_by
  and exists (
    select 1 from public.family_members fm
    where fm.family_id = events.family_id and fm.user_id = auth.uid()
  )
);

create policy "members can update family events"
on public.events
for update
using (
  exists (
    select 1 from public.family_members fm
    where fm.family_id = events.family_id and fm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.family_members fm
    where fm.family_id = events.family_id and fm.user_id = auth.uid()
  )
);

create policy "members can delete family events"
on public.events
for delete
using (
  exists (
    select 1 from public.family_members fm
    where fm.family_id = events.family_id and fm.user_id = auth.uid()
  )
);
