import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchDashboard } from '@/coding/api/questionApi';
import { fetchSubmissions } from '@/coding/api/submissionApi';
import { inLastMonths } from '@/coding/activity';
import { SubmissionCalendar } from '@/coding/components/SubmissionCalendar';
import { AppShell } from '@/components/app-shell';
import { spaNavigate } from '@/lib/spa-nav';
import { DIFFICULTY_FILL, submissionTone } from '@/coding/statusColors';
import { useAuth } from '@/providers/auth-provider';

const HISTORY_MONTHS = 3;

export default function DashboardScreen() {
  const { user, session, loading: authLoading } = useAuth();
  const [historyOpen, setHistoryOpen] = useState(false);
  const enabled = Boolean(session) && !authLoading;
  const dash = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard, enabled });
  const subs = useQuery({ queryKey: ['submissions'], queryFn: fetchSubmissions, enabled });

  const submissions = subs.data?.submissions ?? [];
  const preview = submissions.slice(0, 2);
  const history = useMemo(
    () => submissions.filter((s) => inLastMonths(s.createdAt, HISTORY_MONTHS)),
    [submissions],
  );
  const data = dash.data;

  return (
    <AppShell>
      <div className="db">
        <style>{css}</style>
        <p className="db-kicker">Dashboard</p>
        <h1>Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}</h1>
        {dash.isLoading || subs.isLoading ? <p className="db-muted">Loading your workspace…</p> : null}
        {dash.error ? <p className="db-err">Could not load dashboard.</p> : null}

        <SubmissionCalendar submissions={submissions} />

        {data ? (
          <>
            <section className="db-kpis">
              <article><span>Solved</span><strong>{data.solved}</strong></article>
              <article><span>Attempted</span><strong>{data.attempted}</strong></article>
              <article><span>Total</span><strong>{data.total}</strong></article>
            </section>
            <section className="db-card">
              <h2>Progress</h2>
              {data.difficultyProgress.map((d) => (
                <div key={d.difficulty} className="db-prog">
                  <div className="db-prog-row"><span>{d.difficulty}</span><span>{d.percent}%</span></div>
                  <div className="db-track">
                    <div style={{ width: `${d.percent}%`, background: DIFFICULTY_FILL[d.difficulty] }} />
                  </div>
                </div>
              ))}
            </section>
            <section className="db-card">
              <h2>Recent practice</h2>
              {data.recentPractice.length === 0 ? <p className="db-muted">No recent practice yet.</p> : null}
              <ul>
                {data.recentPractice.map((item) => (
                  <li key={item.questionId}>
                    <a href={`/practice/${item.questionId}`} onClick={(e) => spaNavigate(`/practice/${item.questionId}`, e)}>
                      <strong>{item.title}</strong>
                      <span>{item.status.replace(/_/g, ' ')}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
            <section className="db-card">
              <h2>Recommended</h2>
              {data.recommended.length === 0 ? <p className="db-muted">You are caught up on recommendations.</p> : null}
              <ul>
                {data.recommended.map((q) => (
                  <li key={q.id}>
                    <a href={`/practice/${q.id}`} onClick={(e) => spaNavigate(`/practice/${q.id}`, e)}>
                      <strong>{q.title}</strong>
                      <span>{q.difficulty}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}

        <section className="db-card">
          <h2>Submissions</h2>
          <p className="db-muted">Latest two by problem name. Expand for the last {HISTORY_MONTHS} months.</p>
          {subs.error ? <p className="db-err">Failed to load submissions.</p> : null}
          {preview.length === 0 ? (
            <p className="db-muted">No submissions yet. Run tests, then submit from practice.</p>
          ) : (
            <div className="db-preview">
              {preview.map((s) => (
                <a
                  key={s.id}
                  className="db-preview-card"
                  href={`/submissions/${s.id}`}
                  onClick={(e) => spaNavigate(`/submissions/${s.id}`, e)}
                >
                  <p className="db-kicker">{s.language}</p>
                  <h3>{s.questionTitle}</h3>
                  <p>
                    <span className={submissionTone(s.status)}>{s.status.replace(/_/g, ' ')}</span>
                    {' · '}
                    {s.executionTime}
                    {' · '}
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                </a>
              ))}
            </div>
          )}
          <button type="button" className="db-collapse" onClick={() => setHistoryOpen((o) => !o)}>
            {historyOpen ? 'Collapse history' : `Show last ${HISTORY_MONTHS} months`}
          </button>
          {historyOpen ? (
            <div className="db-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Runtime</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <a href={`/submissions/${s.id}`} onClick={(e) => spaNavigate(`/submissions/${s.id}`, e)}>
                          {s.questionTitle}
                        </a>
                      </td>
                      <td>{s.language}</td>
                      <td className={submissionTone(s.status)}>{s.status.replace(/_/g, ' ')}</td>
                      <td>{s.executionTime}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {history.length === 0 ? <p className="db-muted">No submissions in the last {HISTORY_MONTHS} months.</p> : null}
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

const css = `
.db { max-width:76rem; width:100%; box-sizing:border-box; margin:0 auto; padding:1.5rem 1.25rem 3rem; color:#111827; display:flex; flex-direction:column; gap:1rem; font-family:'Inter',system-ui,-apple-system,sans-serif; }
.db-kicker { margin:0; font-size:11px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#6366f1; }
.db h1 { margin:0; font-size:1.7rem; letter-spacing:-.02em; color:#111827; }
.db h2 { margin:0 0 .75rem; font-size:1.05rem; color:#111827; }
.db-muted { color:#6b7280; font-size:.9rem; }
.db-err { color:#b91c1c; }
.db-kpis { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; }
.db-kpis article { background:#fff; border:1px solid #e5e7eb; border-radius:.75rem; padding:.9rem; text-align:center; box-shadow:0 1px 2px rgb(0 0 0/.04); }
.db-kpis span { color:#6b7280; font-size:.8rem; }
.db-kpis strong { display:block; font-size:1.6rem; margin-top:.2rem; color:#111827; }
.db-card { background:#fff; border:1px solid #e5e7eb; border-radius:.75rem; padding:1.1rem 1.2rem; box-shadow:0 1px 2px rgb(0 0 0/.04); }
.db-prog { margin-bottom:.75rem; }
.db-prog-row { display:flex; justify-content:space-between; font-size:.85rem; font-weight:600; color:#374151; }
.db-track { height:6px; background:#f3f4f6; border-radius:99px; overflow:hidden; margin-top:.35rem; }
.db-track div { height:100%; }
.db-card ul { list-style:none; margin:0; padding:0; }
.db-card li a { display:flex; justify-content:space-between; gap:.75rem; padding:.55rem 0; border-bottom:1px solid #f3f4f6; text-decoration:none; color:#111827; }
.db-card li a:hover strong { color:#6366f1; }
.db-preview { display:grid; grid-template-columns:repeat(2,1fr); gap:.75rem; margin:.75rem 0; }
@media (max-width:700px) { .db-preview, .db-kpis { grid-template-columns:1fr; } }
.db-preview-card { display:block; text-decoration:none; color:inherit; border:1px solid #e5e7eb; border-radius:.75rem; padding:.9rem 1rem; background:#f9fafb; transition:border-color .15s,background .15s; }
.db-preview-card:hover { border-color:#c7d2fe; background:#eef2ff; }
.db-preview-card h3 { margin:.35rem 0 .4rem; font-size:1.05rem; color:#111827; }
.db-preview-card p { margin:0; color:#6b7280; font-size:.85rem; }
.db-collapse { margin-top:.35rem; border:1px solid #6366f1; background:#6366f1; color:#fff; border-radius:.5rem; height:2.4rem; padding:0 .9rem; font-weight:700; cursor:pointer; transition:background .15s; }
.db-collapse:hover { background:#4f46e5; border-color:#4f46e5; }
.db-table-wrap { margin-top:.85rem; max-height:18rem; overflow:auto; border:1px solid #e5e7eb; border-radius:.75rem; }
.db-table-wrap table { width:100%; border-collapse:collapse; font-size:.85rem; }
.db-table-wrap th, .db-table-wrap td { text-align:left; padding:.55rem .7rem; border-bottom:1px solid #f3f4f6; }
.db-table-wrap th { background:#f9fafb; color:#6b7280; position:sticky; top:0; font-weight:600; }
.db-table-wrap a { color:#111827; font-weight:700; text-decoration:none; }
.db-table-wrap a:hover { color:#6366f1; }
.ok { color:#15803d; font-weight:700; }
.pending { color:#b45309; font-weight:700; }
.fail { color:#dc2626; font-weight:700; }
`;
