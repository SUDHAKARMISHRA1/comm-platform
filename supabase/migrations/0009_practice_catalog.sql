-- Practice catalog (skills, topics, levels, problems).
-- Admin CRUD writes here via the service role. The JSON store is only a fallback.

create table if not exists public.practice_skills (
  id text primary key,
  name text not null,
  slug text not null,
  language_key text,
  sequence integer not null default 1,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.practice_topics (
  id text primary key,
  name text not null,
  slug text not null,
  sequence integer not null default 1,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.practice_levels (
  id text primary key,
  name text not null,
  slug text not null,
  band text not null default 'EASY',
  sequence integer not null default 1,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.practice_questions (
  id bigint primary key,
  practice_set_id text not null default '',
  sequence integer not null default 1,
  title text not null,
  slug text not null default '',
  difficulty text not null default 'EASY',
  description text not null default '',
  input_format text not null default '',
  output_format text not null default '',
  constraints text not null default '',
  examples jsonb not null default '[]'::jsonb,
  skill_id text not null,
  level_id text not null,
  topics jsonb not null default '[]'::jsonb,
  supported_languages jsonb not null default '[]'::jsonb,
  code_templates jsonb not null default '{}'::jsonb,
  test_cases jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists practice_skills_sequence_idx on public.practice_skills (sequence);
create index if not exists practice_topics_sequence_idx on public.practice_topics (sequence);
create index if not exists practice_levels_sequence_idx on public.practice_levels (sequence);
create index if not exists practice_questions_skill_idx on public.practice_questions (skill_id, sequence);
create index if not exists practice_questions_level_idx on public.practice_questions (level_id);
create index if not exists practice_questions_published_idx on public.practice_questions (published);

alter table public.practice_skills enable row level security;
alter table public.practice_topics enable row level security;
alter table public.practice_levels enable row level security;
alter table public.practice_questions enable row level security;

grant select, insert, update, delete on public.practice_skills to service_role;
grant select, insert, update, delete on public.practice_topics to service_role;
grant select, insert, update, delete on public.practice_levels to service_role;
grant select, insert, update, delete on public.practice_questions to service_role;
