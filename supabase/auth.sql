-- Real accounts for the Varam campus.
-- Students can use the LMS as soon as they register.
-- Trainers stay pending until varamtrust.nlr@gmail.com opens the approval link.
-- sriajay50@gmail.com is the Trust admin.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null default 'student' check (role in ('student', 'trainer', 'admin')),
  goal text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text not null default '';
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists approved_at timestamptz;

do $$
begin
  alter table public.profiles
    add constraint profiles_status_check check (status in ('active', 'pending'));
exception
  when duplicate_object then null;
end $$;

create table if not exists public.trainer_approvals (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  token uuid not null unique,
  created_at timestamptz not null default now()
);

do $$
begin
  execute 'create extension if not exists pg_net';
exception
  when others then
    raise notice 'pg_net was left as already installed: %', sqlerrm;
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_role text;
  next_name text;
  site text;
  approval uuid;
begin
  next_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  next_role := case
    when lower(new.email) = 'sriajay50@gmail.com' then 'admin'
    when new.raw_user_meta_data->>'role' = 'trainer' then 'trainer'
    else 'student'
  end;

  insert into public.profiles (id, name, email, role, status, approved_at)
  values (
    new.id,
    next_name,
    coalesce(new.email, ''),
    next_role,
    case when next_role = 'trainer' then 'pending' else 'active' end,
    case when next_role = 'trainer' then null else now() end
  )
  on conflict (id) do nothing;

  if next_role = 'trainer' then
    approval := gen_random_uuid();
    insert into public.trainer_approvals (user_id, token)
    values (new.id, approval)
    on conflict (user_id) do update set token = excluded.token, created_at = now();

    site := new.raw_user_meta_data->>'site';
    if site is null or site !~ '^https?://[A-Za-z0-9.:-]+$' then
      site := 'http://localhost:3000';
    end if;

    begin
      perform net.http_post(
        url := 'https://formsubmit.co/ajax/varamtrust.nlr@gmail.com',
        headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
        body := jsonb_build_object(
          '_subject', 'Approve Varam trainer: ' || next_name,
          '_template', 'table',
          '_captcha', 'false',
          'name', next_name,
          'email', new.email,
          'role', 'trainer',
          'message', 'This trainer cannot open the workspace until you approve them. Open this link: ' || rtrim(site, '/') || '/approve?token=' || approval::text
        )
      );
    exception
      when undefined_function or invalid_schema_name then
        begin
          perform extensions.http_post(
            url := 'https://formsubmit.co/ajax/varamtrust.nlr@gmail.com',
            headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
            body := jsonb_build_object(
              '_subject', 'Approve Varam trainer: ' || next_name,
              '_template', 'table',
              '_captcha', 'false',
              'name', next_name,
              'email', new.email,
              'role', 'trainer',
              'message', 'This trainer cannot open the workspace until you approve them. Open this link: ' || rtrim(site, '/') || '/approve?token=' || approval::text
            )
          );
        exception
          when others then
            null;
        end;
      when others then
        null;
    end;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

update public.profiles as profile
set
  role = 'trainer',
  status = 'pending',
  approved_at = null
from auth.users as account
where profile.id = account.id
  and account.raw_user_meta_data->>'role' = 'trainer'
  and profile.role = 'student'
  and lower(account.email) <> 'sriajay50@gmail.com';

update public.profiles as profile
set email = account.email
from auth.users as account
where profile.id = account.id
  and profile.email = '';

update public.profiles
set status = 'pending', approved_at = null
where role = 'trainer' and approved_at is null and status <> 'pending';

create or replace function public.profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.profile_status()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select status from public.profiles where id = auth.uid()
$$;

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when public.profile_role() = 'trainer' and public.profile_status() is distinct from 'active' then 'student'
    else public.profile_role()
  end
$$;

create or replace function public.approve_trainer(approval_token uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid;
begin
  select user_id into target
  from public.trainer_approvals
  where token = approval_token;

  if target is null then
    return 'invalid';
  end if;

  update public.profiles
  set status = 'active', approved_at = now(), updated_at = now()
  where id = target and role = 'trainer' and status = 'pending';

  delete from public.trainer_approvals where user_id = target;
  return 'approved';
end;
$$;

create or replace function public.approve_trainer_account(target uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.profile_role() is distinct from 'admin' or public.profile_status() is distinct from 'active' then
    return 'forbidden';
  end if;

  update public.profiles
  set status = 'active', approved_at = now(), updated_at = now()
  where id = target and role = 'trainer' and status = 'pending';

  if not found then
    return 'invalid';
  end if;

  delete from public.trainer_approvals where user_id = target;
  return 'approved';
end;
$$;

revoke all on function public.approve_trainer(uuid) from public;
revoke all on function public.approve_trainer_account(uuid) from public;
grant execute on function public.approve_trainer(uuid) to anon, authenticated;
grant execute on function public.approve_trainer_account(uuid) to authenticated;

insert into public.profiles (id, name, email, role, status, approved_at)
select
  id,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  coalesce(email, ''),
  case
    when lower(email) = 'sriajay50@gmail.com' then 'admin'
    when raw_user_meta_data->>'role' = 'trainer' then 'trainer'
    else 'student'
  end,
  case when raw_user_meta_data->>'role' = 'trainer' and lower(email) <> 'sriajay50@gmail.com' then 'pending' else 'active' end,
  case when raw_user_meta_data->>'role' = 'trainer' and lower(email) <> 'sriajay50@gmail.com' then null else now() end
from auth.users
on conflict (id) do nothing;

alter table public.profiles enable row level security;

drop policy if exists "read profiles" on public.profiles;
create policy "read profiles"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.current_role() in ('admin', 'trainer'));

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = public.profile_role()
    and status = public.profile_status()
  );

alter table public.trainer_approvals enable row level security;
revoke all on public.trainer_approvals from anon, authenticated;

drop policy if exists "admin manages profiles" on public.profiles;
create policy "admin manages profiles"
  on public.profiles for update
  to authenticated
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

revoke all on public.learner_records from anon;
revoke all on public.campus_content from anon;
grant select, insert, update, delete on public.learner_records to authenticated;
grant select, insert, update, delete on public.campus_content to authenticated;
grant select, update on public.profiles to authenticated;

drop policy if exists "demo learners can use their rows" on public.learner_records;
drop policy if exists "own or staff learner record" on public.learner_records;
create policy "own or staff learner record"
  on public.learner_records for all
  to authenticated
  using (
    id = auth.uid()::text
    or public.current_role() in ('admin', 'trainer')
  )
  with check (
    id = auth.uid()::text
    or public.current_role() in ('admin', 'trainer')
  );

drop policy if exists "demo campus content is shared" on public.campus_content;
drop policy if exists "read campus" on public.campus_content;
drop policy if exists "staff edit campus" on public.campus_content;
create policy "read campus"
  on public.campus_content for select
  to authenticated
  using (true);

create policy "staff edit campus"
  on public.campus_content for all
  to authenticated
  using (public.current_role() in ('admin', 'trainer'))
  with check (public.current_role() in ('admin', 'trainer'));
