-- Interview sighting votes: one row per user per question (toggle removes the row).
-- question_vote_counts is the denormalized total used for ranking.

create table if not exists public.question_interview_votes (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id integer not null,
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table if not exists public.question_vote_counts (
  question_id integer primary key,
  vote_count integer not null default 0 check (vote_count >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists question_interview_votes_question_idx
  on public.question_interview_votes (question_id);

create index if not exists question_vote_counts_rank_idx
  on public.question_vote_counts (vote_count desc, question_id);

alter table public.question_interview_votes enable row level security;
alter table public.question_vote_counts enable row level security;

drop policy if exists "Authenticated can read interview votes" on public.question_interview_votes;
create policy "Authenticated can read interview votes"
on public.question_interview_votes
for select
to authenticated
using (true);

drop policy if exists "Users can insert own interview votes" on public.question_interview_votes;
create policy "Users can insert own interview votes"
on public.question_interview_votes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own interview votes" on public.question_interview_votes;
create policy "Users can delete own interview votes"
on public.question_interview_votes
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Authenticated can read vote counts" on public.question_vote_counts;
create policy "Authenticated can read vote counts"
on public.question_vote_counts
for select
to authenticated
using (true);
