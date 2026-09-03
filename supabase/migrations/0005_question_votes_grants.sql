-- Grants for interview votes. The API writes with the service role.
-- Safe to re-run after 0004.

grant select, insert, delete on public.question_interview_votes to authenticated, service_role;
grant select on public.question_vote_counts to authenticated;
grant select, insert, update on public.question_vote_counts to service_role;
