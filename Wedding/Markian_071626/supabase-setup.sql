-- Run in the Supabase SQL Editor to activate Markian_071626.

alter table public.projects
  add column if not exists reserved_family_seats integer not null default 0;

alter table public.projects
  drop constraint if exists reserved_family_seats_within_capacity;

alter table public.projects
  add constraint reserved_family_seats_within_capacity
  check (reserved_family_seats >= 0 and reserved_family_seats <= total_seats);

alter table public.rsvp_submissions
  add column if not exists review_status text not null default 'received';

alter table public.rsvp_submissions
  drop constraint if exists valid_review_status;

alter table public.rsvp_submissions
  add constraint valid_review_status
  check (review_status in ('received', 'manual_review'));

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

drop trigger if exists check_rsvp_capacity_before_insert on public.rsvp_submissions;
drop trigger if exists set_rsvp_review_status_before_insert on public.rsvp_submissions;

create trigger set_rsvp_review_status_before_insert
before insert on public.rsvp_submissions
for each row execute function public.set_rsvp_review_status();

revoke execute on function public.set_rsvp_review_status()
from public, anon, authenticated;

insert into public.projects (
  project_id, client_name, event_type, total_seats, reserved_family_seats
)
values (
  'Markian_071626', 'Mark Ian and Sariel', 'Wedding', 400, 50
)
on conflict (project_id) do update
set
  client_name = excluded.client_name,
  event_type = excluded.event_type,
  total_seats = excluded.total_seats,
  reserved_family_seats = excluded.reserved_family_seats,
  updated_at = now();

drop policy if exists "Public dashboard reads Markian project" on public.projects;
create policy "Public dashboard reads Markian project"
on public.projects for select to anon
using (project_id = 'Markian_071626');

drop policy if exists "Public dashboard updates Markian project" on public.projects;
create policy "Public dashboard updates Markian project"
on public.projects for update to anon
using (project_id = 'Markian_071626')
with check (project_id = 'Markian_071626');

drop policy if exists "Public dashboard reads Markian RSVPs" on public.rsvp_submissions;
create policy "Public dashboard reads Markian RSVPs"
on public.rsvp_submissions for select to anon
using (project_id = 'Markian_071626');
