insert into public.projects (project_id,client_name,event_type,total_seats,reserved_family_seats)
values ('Michael_071626','Michael','Birthday',100,20)
on conflict (project_id) do update set client_name=excluded.client_name,event_type=excluded.event_type,total_seats=excluded.total_seats,reserved_family_seats=excluded.reserved_family_seats,updated_at=now();

drop policy if exists "Public dashboard reads Michael project" on public.projects;
create policy "Public dashboard reads Michael project" on public.projects for select to anon using (project_id='Michael_071626');
drop policy if exists "Public dashboard updates Michael project" on public.projects;
create policy "Public dashboard updates Michael project" on public.projects for update to anon using (project_id='Michael_071626') with check (project_id='Michael_071626');
drop policy if exists "Public dashboard reads Michael RSVPs" on public.rsvp_submissions;
create policy "Public dashboard reads Michael RSVPs" on public.rsvp_submissions for select to anon using (project_id='Michael_071626');
