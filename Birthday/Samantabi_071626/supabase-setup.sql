-- Run this in the Supabase SQL Editor to activate Samantabi_071626.
-- It assumes the shared public.projects and public.rsvp_submissions tables exist.

alter table public.projects
  add column if not exists reserved_family_seats integer not null default 0;

alter table public.projects
  drop constraint if exists reserved_family_seats_within_capacity;

alter table public.projects
  add constraint reserved_family_seats_within_capacity
  check (
    reserved_family_seats >= 0
    and reserved_family_seats <= total_seats
  );

alter table public.rsvp_submissions
  add column if not exists review_status text not null default 'received';

alter table public.rsvp_submissions
  drop constraint if exists valid_review_status;

alter table public.rsvp_submissions
  add constraint valid_review_status
  check (review_status in ('received', 'manual_review'));

-- Manual-review capacity behavior:
-- accept an RSVP that exceeds public capacity, but flag it.
create or replace function public.set_rsvp_review_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  public_capacity integer;
  currently_reserved integer;
begin
  select total_seats - reserved_family_seats
    into public_capacity
  from public.projects
  where project_id = new.project_id
  for update;

  if public_capacity is null then
    raise exception 'Invalid project ID';
  end if;

  select coalesce(sum(total_party_size), 0)
    into currently_reserved
  from public.rsvp_submissions
  where project_id = new.project_id;

  if currently_reserved + new.total_party_size > public_capacity then
    new.review_status := 'manual_review';
  else
    new.review_status := 'received';
  end if;

  return new;
end;
$$;

drop trigger if exists check_rsvp_capacity_before_insert
  on public.rsvp_submissions;

drop trigger if exists set_rsvp_review_status_before_insert
  on public.rsvp_submissions;

create trigger set_rsvp_review_status_before_insert
before insert on public.rsvp_submissions
for each row
execute function public.set_rsvp_review_status();

revoke execute on function public.set_rsvp_review_status()
from public, anon, authenticated;

-- Create or refresh this project's capacity row.
insert into public.projects (
  project_id,
  client_name,
  event_type,
  total_seats,
  reserved_family_seats
)
values (
  'Samantabi_071626',
  'Samantabi',
  'Birthday',
  100,
  10
)
on conflict (project_id) do update
set
  client_name = excluded.client_name,
  event_type = excluded.event_type,
  total_seats = excluded.total_seats,
  reserved_family_seats = excluded.reserved_family_seats,
  updated_at = now();

-- This project uses the requested local JavaScript dashboard login,
-- not Supabase Authentication.
--
-- The following policies allow the publishable/anonymous browser client
-- to read and update Samantabi's project-scoped dashboard data.
-- IMPORTANT: local JavaScript login is not secure database authorization.
-- A technical user can call these database operations outside the dashboard.

drop policy if exists "Public dashboard reads Samantabi project"
  on public.projects;
create policy "Public dashboard reads Samantabi project"
on public.projects for select
to anon
using (project_id = 'Samantabi_071626');

drop policy if exists "Public dashboard updates Samantabi project"
  on public.projects;
create policy "Public dashboard updates Samantabi project"
on public.projects for update
to anon
using (project_id = 'Samantabi_071626')
with check (project_id = 'Samantabi_071626');

drop policy if exists "Public dashboard reads Samantabi RSVPs"
  on public.rsvp_submissions;
create policy "Public dashboard reads Samantabi RSVPs"
on public.rsvp_submissions for select
to anon
using (project_id = 'Samantabi_071626');
