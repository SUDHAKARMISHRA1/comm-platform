-- Social engagement for admin-published highlight feed posts.
-- Post bodies stay in the coding store; these tables hold likes, shares, and comments.

create table if not exists public.highlight_post_likes (
  user_id uuid not null references auth.users (id) on delete cascade,
  post_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table if not exists public.highlight_post_shares (
  user_id uuid not null references auth.users (id) on delete cascade,
  post_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table if not exists public.highlight_comments (
  id text primary key,
  post_id text not null,
  parent_id text references public.highlight_comments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null default 'Member',
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.highlight_comment_likes (
  user_id uuid not null references auth.users (id) on delete cascade,
  comment_id text not null references public.highlight_comments (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, comment_id)
);

create index if not exists highlight_post_likes_post_idx on public.highlight_post_likes (post_id);
create index if not exists highlight_post_shares_post_idx on public.highlight_post_shares (post_id);
create index if not exists highlight_comments_post_idx on public.highlight_comments (post_id, created_at);
create index if not exists highlight_comment_likes_comment_idx on public.highlight_comment_likes (comment_id);

alter table public.highlight_post_likes enable row level security;
alter table public.highlight_post_shares enable row level security;
alter table public.highlight_comments enable row level security;
alter table public.highlight_comment_likes enable row level security;

create policy "Authenticated can read post likes"
on public.highlight_post_likes for select to authenticated using (true);
create policy "Users can insert own post likes"
on public.highlight_post_likes for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own post likes"
on public.highlight_post_likes for delete to authenticated using (auth.uid() = user_id);

create policy "Authenticated can read post shares"
on public.highlight_post_shares for select to authenticated using (true);
create policy "Users can insert own post shares"
on public.highlight_post_shares for insert to authenticated with check (auth.uid() = user_id);

create policy "Authenticated can read comments"
on public.highlight_comments for select to authenticated using (true);
create policy "Users can insert own comments"
on public.highlight_comments for insert to authenticated with check (auth.uid() = user_id);

create policy "Authenticated can read comment likes"
on public.highlight_comment_likes for select to authenticated using (true);
create policy "Users can insert own comment likes"
on public.highlight_comment_likes for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own comment likes"
on public.highlight_comment_likes for delete to authenticated using (auth.uid() = user_id);

grant select, insert, delete on public.highlight_post_likes to authenticated, service_role;
grant select, insert on public.highlight_post_shares to authenticated, service_role;
grant select, insert on public.highlight_comments to authenticated, service_role;
grant select, insert, delete on public.highlight_comment_likes to authenticated, service_role;
