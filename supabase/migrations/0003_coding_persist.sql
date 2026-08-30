-- Persist coding submissions and progress in Postgres.
-- Question catalog stays in the app store; question_id is not a foreign key.

create table if not exists public.user_question_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id integer not null,
  status text not null check (status in ('ATTEMPTED', 'SOLVED')),
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table if not exists public.code_submissions (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id integer not null,
  language text not null,
  source_code text not null,
  status text not null,
  passed_test_cases integer not null default 0,
  total_test_cases integer not null default 0,
  execution_time text not null default '',
  memory text not null default '',
  test_case_results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.code_submissions drop constraint if exists code_submissions_question_id_fkey;
alter table public.user_question_progress drop constraint if exists user_question_progress_question_id_fkey;

create index if not exists submissions_user_created_idx
  on public.code_submissions (user_id, created_at desc);

create index if not exists progress_user_updated_idx
  on public.user_question_progress (user_id, updated_at desc);

alter table public.user_question_progress enable row level security;
alter table public.code_submissions enable row level security;

drop policy if exists "Users can read own progress" on public.user_question_progress;
create policy "Users can read own progress"
on public.user_question_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can upsert own progress" on public.user_question_progress;
create policy "Users can upsert own progress"
on public.user_question_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_question_progress;
create policy "Users can update own progress"
on public.user_question_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own submissions" on public.code_submissions;
create policy "Users can read own submissions"
on public.code_submissions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own submissions" on public.code_submissions;
create policy "Users can insert own submissions"
on public.code_submissions
for insert
to authenticated
with check (auth.uid() = user_id);
