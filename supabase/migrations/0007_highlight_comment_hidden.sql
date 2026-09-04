-- Admin moderation for highlight comments/replies.
alter table public.highlight_comments
  add column if not exists hidden boolean not null default false;

grant update on public.highlight_comments to service_role;
