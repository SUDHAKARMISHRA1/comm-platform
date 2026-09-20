-- Frontend API failure log (admin monitor).
-- Run in Supabase Dashboard → SQL Editor as the `postgres` role.
-- Success responses are intentionally not stored (high volume). Extra fields can be added later via metadata.

create table if not exists public.frontend_api_failures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  method text not null default 'GET',
  path text not null,
  status_code integer not null default 0,
  error_code text,
  error_message text,
  request_id text,
  client_platform text,
  app_version text,
  user_agent text,
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint frontend_api_failures_method_len check (char_length(method) between 1 and 16),
  constraint frontend_api_failures_path_len check (char_length(path) between 1 and 300),
  constraint frontend_api_failures_status_range check (status_code >= 0 and status_code <= 599),
  constraint frontend_api_failures_error_len check (error_message is null or char_length(error_message) <= 2000),
  constraint frontend_api_failures_error_code_len check (error_code is null or char_length(error_code) <= 80)
);

create index if not exists frontend_api_failures_created_idx
  on public.frontend_api_failures (created_at desc);

create index if not exists frontend_api_failures_path_created_idx
  on public.frontend_api_failures (path, created_at desc);

create index if not exists frontend_api_failures_status_created_idx
  on public.frontend_api_failures (status_code, created_at desc);

create index if not exists frontend_api_failures_user_created_idx
  on public.frontend_api_failures (user_id, created_at desc);

alter table public.frontend_api_failures enable row level security;

drop policy if exists "Users can insert own api failures" on public.frontend_api_failures;
create policy "Users can insert own api failures"
on public.frontend_api_failures
for insert
to authenticated
with check (auth.uid() = user_id);

grant insert on public.frontend_api_failures to authenticated;
grant select, insert, delete on public.frontend_api_failures to service_role;

comment on table public.frontend_api_failures is
  'Product-app API failures only. Successful requests are not written.';
comment on column public.frontend_api_failures.status_code is
  'HTTP status. 0 means a network/client error before a response.';
comment on column public.frontend_api_failures.metadata is
  'Reserved JSON for later fields (correlation, screen, extra context).';
