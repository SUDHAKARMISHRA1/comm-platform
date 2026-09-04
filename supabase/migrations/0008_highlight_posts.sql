-- Highlight posts themselves (title, body, media blocks, publish flag).
-- Likes/comments already live in 0006; this moves post bodies out of the local JSON store.

create table if not exists public.highlight_posts (
  id text primary key,
  kind text not null default 'article',
  title text not null,
  body text not null default '',
  media_url text not null default '',
  link_url text not null default '',
  author_name text not null default 'Comm Platform',
  published boolean not null default false,
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists highlight_posts_published_created_idx
  on public.highlight_posts (published, created_at desc);

alter table public.highlight_posts enable row level security;

drop policy if exists "Authenticated can read published highlight posts" on public.highlight_posts;
create policy "Authenticated can read published highlight posts"
on public.highlight_posts
for select
to authenticated
using (published = true);

grant select on public.highlight_posts to authenticated, service_role;
grant insert, update, delete on public.highlight_posts to service_role;

-- Admin deletes a post and its thread via the service role.
grant delete on public.highlight_comments to service_role;
grant delete on public.highlight_post_shares to service_role;
