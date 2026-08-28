-- Coding platform schema (migrate from data/coding/store.json)
-- Maps 1:1 to packages/coding/src/schema.ts

create table if not exists public.practice_sets (
  id text primary key,
  title text not null,
  slug text not null unique,
  description text not null default '',
  topics text[] not null default '{}',
  languages text[] not null default '{java,c,cpp}',
  sequence integer not null default 1,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id serial primary key,
  practice_set_id text not null references public.practice_sets (id) on delete cascade,
  sequence integer not null default 1,
  title text not null,
  slug text not null,
  difficulty text not null check (difficulty in ('EASY', 'MEDIUM', 'HARD')),
  description text not null,
  input_format text not null default '',
  output_format text not null default '',
  constraints text not null default '',
  examples jsonb not null default '[]',
  topics text[] not null default '{}',
  supported_languages text[] not null default '{java,c,cpp}',
  code_templates jsonb not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (practice_set_id, slug)
);

create table if not exists public.question_test_cases (
  id text primary key,
  question_id integer not null references public.questions (id) on delete cascade,
  input text not null,
  expected_output text not null,
  hidden boolean not null default true,
  sequence integer not null default 1
);

create table if not exists public.user_question_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id integer not null references public.questions (id) on delete cascade,
  status text not null check (status in ('ATTEMPTED', 'SOLVED')),
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table if not exists public.code_submissions (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id integer not null references public.questions (id) on delete cascade,
  language text not null,
  source_code text not null,
  status text not null,
  passed_test_cases integer not null default 0,
  total_test_cases integer not null default 0,
  execution_time text not null default '',
  memory text not null default '',
  test_case_results jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists questions_practice_set_sequence_idx on public.questions (practice_set_id, sequence);
create index if not exists submissions_user_created_idx on public.code_submissions (user_id, created_at desc);
