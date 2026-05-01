-- PKL Notes Supabase bootstrap
-- Run this in the Supabase SQL editor after your tables exist.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where email_user = auth.uid()
      and role = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (email_user, role, password)
  select new.id, false, 'managed-by-supabase-auth'
  where not exists (
    select 1
    from public.users
    where email_user = new.id
  );

  return new;
end;
$$;

create or replace function public.set_pkl_notes_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.pkl_notes enable row level security;

alter table public.pkl_notes
  add column if not exists status text;

update public.pkl_notes
set status = 'pending'
where status is null;

alter table public.pkl_notes
  alter column status set default 'pending';

alter table public.pkl_notes
  alter column updated_at set default now();

drop trigger if exists on_pkl_notes_updated_at on public.pkl_notes;
create trigger on_pkl_notes_updated_at
before update on public.pkl_notes
for each row
execute function public.set_pkl_notes_updated_at();

drop policy if exists "users_select_own_or_admin" on public.users;
create policy "users_select_own_or_admin"
on public.users
for select
to authenticated
using (email_user = auth.uid() or public.is_admin());

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self"
on public.users
for insert
to authenticated
with check (email_user = auth.uid());

drop policy if exists "users_update_admin" on public.users;
create policy "users_update_admin"
on public.users
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "pkl_notes_select_own_or_admin" on public.pkl_notes;
create policy "pkl_notes_select_own_or_admin"
on public.pkl_notes
for select
to authenticated
using (
  users_id in (
    select id from public.users where email_user = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "pkl_notes_insert_own" on public.pkl_notes;
create policy "pkl_notes_insert_own"
on public.pkl_notes
for insert
to authenticated
with check (
  users_id in (
    select id from public.users where email_user = auth.uid()
  )
);

drop policy if exists "pkl_notes_update_own_or_admin" on public.pkl_notes;
create policy "pkl_notes_update_own_or_admin"
on public.pkl_notes
for update
to authenticated
using (
  users_id in (
    select id from public.users where email_user = auth.uid()
  )
  or public.is_admin()
)
with check (
  users_id in (
    select id from public.users where email_user = auth.uid()
  )
  or public.is_admin()
);
