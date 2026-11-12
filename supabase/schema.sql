-- Free-plan tables for the Varam demonstration campus.
-- Progress is per browser learner. Course, notice, and gallery edits are shared.
-- The publishable key can read and write these rows because the site does not collect passwords.
-- Scores and profiles here are demonstration records, not official Trust student files.

create table if not exists public.learner_records (
  id text primary key,
  name text not null default 'Demo Student',
  goal text not null default '',
  enrolled_ids jsonb not null default '[]'::jsonb,
  completed_lesson_ids jsonb not null default '[]'::jsonb,
  course_completed_at jsonb not null default '{}'::jsonb,
  last_lesson jsonb not null default '{}'::jsonb,
  attempts jsonb not null default '[]'::jsonb,
  assignment_drafts jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.campus_content (
  id text primary key,
  course_patches jsonb not null default '{}'::jsonb,
  deleted_course_ids jsonb not null default '[]'::jsonb,
  custom_courses jsonb not null default '[]'::jsonb,
  lesson_patches jsonb not null default '{}'::jsonb,
  hidden_lesson_ids jsonb not null default '[]'::jsonb,
  custom_lessons jsonb not null default '{}'::jsonb,
  extra_questions jsonb not null default '[]'::jsonb,
  hidden_question_ids jsonb not null default '[]'::jsonb,
  announcement_extras jsonb not null default '[]'::jsonb,
  announcement_patches jsonb not null default '{}'::jsonb,
  deleted_announcement_ids jsonb not null default '[]'::jsonb,
  gallery_patches jsonb not null default '{}'::jsonb,
  hidden_gallery_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learner_records enable row level security;
alter table public.campus_content enable row level security;

drop policy if exists "demo learners can use their rows" on public.learner_records;
create policy "demo learners can use their rows"
  on public.learner_records
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "demo campus content is shared" on public.campus_content;
create policy "demo campus content is shared"
  on public.campus_content
  for all
  to anon, authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on public.learner_records to anon, authenticated;
grant select, insert, update, delete on public.campus_content to anon, authenticated;
