import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { AppShell } from '@/components/app-shell';
import { VoteButton } from '@/coding/components/VoteButton';
import { fetchVotedQuestions } from '@/coding/api/questionApi';
import { spaNavigate } from '@/lib/spa-nav';
import { useAuth } from '@/providers/auth-provider';

const PAGE_SIZE = 10;

export default function VotedProblemsScreen() {
  const { session, loading: authLoading } = useAuth();
  const params = useLocalSearchParams<{ skill?: string; page?: string }>();
  const skill = typeof params.skill === 'string' ? params.skill : '';
  const page = Math.max(1, Number(params.page ?? '1') || 1);
  const enabled = Boolean(session) && !authLoading;

  const query = useQuery({
    queryKey: ['voted-questions', skill, page],
    queryFn: () => fetchVotedQuestions({ skill: skill || undefined, page, pageSize: PAGE_SIZE }),
    enabled,
  });

  const total = query.data?.pagination.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hrefFor = (nextPage: number) => {
    const qs = new URLSearchParams();
    if (skill) qs.set('skill', skill);
    qs.set('page', String(nextPage));
    return `/practice/voted?${qs}`;
  };

  return (
    <AppShell>
      <div className="vt">
        <style>{css}</style>
        <a className="vt-back" href="/practice" onClick={(e) => spaNavigate('/practice', e)}>← Back to Practice</a>
        <p className="vt-kicker">Interview votes</p>
        <h1>Problems ranked by interview votes</h1>
        <p className="vt-lead">
          These are problems people marked after seeing them in a recent interview. Browse the full ranked list with pagination.
        </p>
        {query.isLoading ? <p className="vt-muted">Loading ranked problems…</p> : null}
        {query.error ? <p className="vt-err">Could not load voted problems.</p> : null}
        {query.data && query.data.questions.length === 0 ? (
          <p className="vt-muted">No interview votes yet. Vote on a problem from Practice if you saw it in an interview.</p>
        ) : null}
        <ol className="vt-list">
          {query.data?.questions.map((q, i) => (
            <li key={q.id}>
              <span className="vt-rank">{String((page - 1) * PAGE_SIZE + i + 1).padStart(2, '0')}</span>
              <a href={`/practice/${q.id}`} onClick={(e) => spaNavigate(`/practice/${q.id}`, e)}>
                <strong>{q.title}</strong>
                <em>{q.topics.slice(0, 2).join(' · ') || 'General'} · {q.difficulty}</em>
              </a>
              <VoteButton questionId={q.id} voteCount={q.voteCount} votedByMe={q.votedByMe} />
            </li>
          ))}
        </ol>
        {total > 0 ? (
          <nav className="vt-pager" aria-label="Pagination">
            {page > 1 ? (
              <a href={hrefFor(page - 1)} onClick={(e) => spaNavigate(hrefFor(page - 1), e)}>Previous</a>
            ) : <span />}
            <span>Page {page} of {pageCount} · {total} problems</span>
            {page < pageCount ? (
              <a href={hrefFor(page + 1)} onClick={(e) => spaNavigate(hrefFor(page + 1), e)}>Next</a>
            ) : <span />}
          </nav>
        ) : null}
      </div>
    </AppShell>
  );
}

const css = `
.vt { max-width:48rem; width:100%; margin:0 auto; padding:1.25rem 1rem 3rem; color:#111827; font-family:'Inter',system-ui,-apple-system,sans-serif; display:flex; flex-direction:column; gap:.9rem; box-sizing:border-box; }
.vt-back { color:#6366f1; font-weight:700; text-decoration:none; font-size:.9rem; }
.vt-kicker { margin:0; font-size:11px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#6366f1; }
.vt h1 { margin:0; font-size:clamp(1.4rem,3vw,1.85rem); letter-spacing:-.03em; }
.vt-lead { margin:0; color:#6b7280; line-height:1.65; }
.vt-muted { margin:0; color:#6b7280; }
.vt-err { margin:0; color:#b91c1c; }
.vt-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.6rem; }
.vt-list li { display:flex; align-items:center; gap:.75rem; background:#fff; border:1px solid #e5e7eb; border-radius:.75rem; padding:.85rem 1rem; box-shadow:0 1px 2px rgb(0 0 0/.04); }
.vt-rank { width:1.75rem; font-size:.75rem; font-weight:800; color:#6366f1; flex-shrink:0; }
.vt-list a { flex:1; min-width:0; text-decoration:none; color:inherit; }
.vt-list a:hover strong { color:#6366f1; }
.vt-list strong { display:block; font-size:.95rem; }
.vt-list em { display:block; margin-top:.2rem; font-style:normal; color:#6b7280; font-size:.78rem; }
.vt-pager { display:flex; justify-content:space-between; align-items:center; gap:1rem; font-size:.875rem; color:#6b7280; }
.vt-pager a { color:#6366f1; font-weight:700; text-decoration:none; }
`;
