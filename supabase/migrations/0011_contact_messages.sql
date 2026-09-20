-- Contact Us messages from the product app (signed-out header or signed-in profile menu).
-- Run in Supabase Dashboard → SQL Editor as the `postgres` role.
-- The API enforces max 1 successful message per UTC day (email, and user_id when signed in).
-- Failed submissions are not stored, so they do not count toward the limit.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  description text not null,
  created_at timestamptz not null default now(),
  submitted_on date not null default ((now() at time zone 'utc')::date),
  constraint contact_messages_name_len check (char_length(name) between 2 and 80),
  constraint contact_messages_email_len check (char_length(email) between 3 and 254),
  constraint contact_messages_description_len check (char_length(description) between 10 and 2000)
);

create unique index if not exists contact_messages_email_day_uidx
  on public.contact_messages (lower(email), submitted_on);

create unique index if not exists contact_messages_user_day_uidx
  on public.contact_messages (user_id, submitted_on)
  where user_id is not null;

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

grant select, insert on public.contact_messages to service_role;

comment on table public.contact_messages is
  'Contact Us form submissions. One successful row per email (and signed-in user) per UTC day.';
comment on column public.contact_messages.submitted_on is
  'UTC calendar date used for the one-message-per-day unique indexes.';
