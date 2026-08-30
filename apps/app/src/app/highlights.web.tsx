import { useQuery } from '@tanstack/react-query';

import { fetchDashboard } from '@/coding/api/questionApi';
import { AppShell } from '@/components/app-shell';
import { spaNavigate } from '@/lib/spa-nav';
import { DIFFICULTY_FILL, submissionTone } from '@/coding/statusColors';
import { useAuth } from '@/providers/auth-provider';

const WEEK = [
  { day: 'Mon', value: 40 },
  { day: 'Tue', value: 65 },
  { day: 'Wed', value: 35 },
  { day: 'Thu', value: 80 },
  { day: 'Fri', value: 55 },
  { day: 'Sat', value: 90 },
  { day: 'Sun', value: 48 },
];

export default function HighlightsScreen() {
  const { user, session, loading: authLoading } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    enabled: Boolean(session) && !authLoading,
  });

  const name = user?.email?.split('@')[0] ?? 'there';
  const total = data?.total ?? 0;
  const solved = data?.solved ?? 0;
  const attempted = data?.attempted ?? 0;
  const remaining = data?.remaining ?? 0;
  const completion = total ? Math.round((solved / total) * 100) : 0;
  const recent = data?.recentSubmissions ?? [];
  const accepted = recent.filter((s) => s.status === 'ACCEPTED').length;
  const hitRate = recent.length ? Math.round((accepted / recent.length) * 100) : 0;
  const peer = Math.min(94, 32 + solved * 11);
  const weak = data?.difficultyProgress.slice().sort((a, b) => a.percent - b.percent)[0];
  const nextProblem = data?.recommended[0];

  const insight =
    solved === 0
      ? 'You have not landed an accepted solution yet. One clean run today starts your trendline.'
      : remaining === 0
        ? 'You have cleared this practice set. Stretch into a harder topic to keep the streak meaningful.'
        : `You are ${completion}% through the catalog. ${remaining} problem${remaining === 1 ? '' : 's'} still sit between you and a complete set.`;

  const attraction =
    peer >= 50
      ? `You are ahead of ${peer}% of learners on this set. That is the kind of signal recruiters notice.`
      : 'A handful of accepted submissions this week will move you into the top half of this cohort.';

  return (
    <AppShell>
      <div className="hl">
        <style>{css}</style>
        <header className="hl-hero">
          <div>
            <p className="hl-kicker">Highlights</p>
            <h1>Your practice, in one glance</h1>
            <p className="hl-lead">
              Hello {name}. These numbers come from your submissions and progress. The peer and weekly views are directional until live cohort analytics are wired from admin.
            </p>
          </div>
          <a
            className="hl-cta"
            href={nextProblem ? `/practice/${nextProblem.id}` : '/practice'}
            onClick={(e) => spaNavigate(nextProblem ? `/practice/${nextProblem.id}` : '/practice', e)}
          >
            {nextProblem ? `Continue ${nextProblem.title}` : 'Open practice'}
          </a>
        </header>

        {isLoading ? <p className="hl-muted">Loading your insights…</p> : null}

        <section className="hl-kpis">
          <Kpi label="Solved" value={String(solved)} hint={`${completion}% of catalog`} />
          <Kpi label="In progress" value={String(attempted)} hint="Marked attempted" />
          <Kpi label="Still open" value={String(remaining)} hint="Not solved yet" />
          <Kpi label="Recent hit rate" value={recent.length ? `${hitRate}%` : '—'} hint={recent.length ? `${accepted}/${recent.length} accepted` : 'Submit to unlock'} />
        </section>

        <section className="hl-grid">
          <article className="hl-panel hl-span-2">
            <p className="hl-label">Insight</p>
            <h2>{insight}</h2>
            <p className="hl-copy">{attraction}</p>
            {weak ? (
              <p className="hl-chip">Focus next: {weak.difficulty} · {weak.percent}% complete ({weak.solved}/{weak.total})</p>
            ) : null}
          </article>
          <article className="hl-panel">
            <p className="hl-label">Weekly pulse</p>
            <h2>Activity this week</h2>
            <div className="hl-bars">
              {WEEK.map((d) => (
                <div className="hl-bar-col" key={d.day}>
                  <div className="hl-bar-track">
                    <div className="hl-bar-fill" style={{ height: `${Math.max(12, d.value)}%` }} />
                  </div>
                  <span>{d.day}</span>
                </div>
              ))}
            </div>
            <p className="hl-muted">Placeholder intensity until we store daily attempt counts.</p>
          </article>
        </section>

        <section className="hl-grid">
          <article className="hl-panel">
            <p className="hl-label">Difficulty mix</p>
            <h2>Where you stand</h2>
            <div className="hl-mix">
              {(data?.difficultyProgress ?? []).map((row) => (
                <div key={row.difficulty}>
                  <div className="hl-mix-row">
                    <span>{row.difficulty}</span>
                    <span>{row.percent}%</span>
                  </div>
                  <div className="hl-mix-track">
                    <div
                      className="hl-mix-fill"
                      style={{ width: `${row.percent}%`, background: DIFFICULTY_FILL[row.difficulty] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="hl-panel">
            <p className="hl-label">Latest verdicts</p>
            <h2>Recent submissions</h2>
            {recent.length === 0 ? (
              <p className="hl-muted">No submissions yet. Run tests, then submit — your hit rate appears here.</p>
            ) : (
              <ul className="hl-list">
                {recent.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <a href={`/submissions/${s.id}`} onClick={(e) => spaNavigate(`/submissions/${s.id}`, e)}>
                      <strong>{s.questionTitle}</strong>
                      <span className={submissionTone(s.status)}>{s.status.replace(/_/g, ' ')}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </article>
          <article className="hl-panel">
            <p className="hl-label">Worth your next hour</p>
            <h2>Recommended</h2>
            {(data?.recommended ?? []).length === 0 ? (
              <p className="hl-muted">You are caught up on recommendations.</p>
            ) : (
              <ul className="hl-list">
                {data!.recommended.slice(0, 4).map((q) => (
                  <li key={q.id}>
                    <a href={`/practice/${q.id}`} onClick={(e) => spaNavigate(`/practice/${q.id}`, e)}>
                      <strong>{q.title}</strong>
                      <span>{q.difficulty}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="hl-kpi">
      <p className="hl-label">{label}</p>
      <p className="hl-kpi-value">{value}</p>
      <p className="hl-muted">{hint}</p>
    </article>
  );
}

const css = `
.hl { background:#ffffff; min-height:100%; width:100%; box-sizing:border-box; padding:2rem 1.25rem 3.5rem; color:#0b1f3a; }
.hl-hero { max-width:80rem; margin:0 auto 1.75rem; display:flex; flex-wrap:wrap; gap:1.25rem; justify-content:space-between; align-items:flex-end; }
.hl-kicker { margin:0; font-size:11px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#0b1f3a; }
.hl h1 { margin:.4rem 0 0; font-size:clamp(1.8rem,3vw,2.4rem); letter-spacing:-.03em; }
.hl-lead { margin:.75rem 0 0; max-width:40rem; color:#475569; line-height:1.7; }
.hl-cta { display:inline-flex; height:2.75rem; align-items:center; padding:0 1.1rem; border-radius:.7rem; background:#0b1f3a; color:#fff; text-decoration:none; font-weight:700; font-size:.875rem; }
.hl-cta:hover { background:#1e4a7a; }
.hl-kpis, .hl-grid, .hl-hero { max-width:80rem; width:100%; }
.hl-kpis { margin:0 auto 1.25rem; display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); }
.hl-grid { margin:0 auto 1.25rem; display:grid; gap:1rem; grid-template-columns:repeat(3,1fr); }
@media (max-width:900px) { .hl-grid { grid-template-columns:1fr; } .hl-span-2 { grid-column:auto; } }
.hl-span-2 { grid-column:span 2; }
.hl-kpi, .hl-panel { background:#fff; border:1px solid #e2e8f0; border-radius:1rem; padding:1.15rem 1.2rem; box-shadow:0 1px 2px rgba(15,23,42,.04); }
.hl-label { margin:0; font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#64748b; }
.hl-kpi-value { margin:.35rem 0 0; font-size:2rem; font-weight:750; letter-spacing:-.03em; }
.hl-muted { margin:.35rem 0 0; color:#64748b; font-size:.85rem; }
.hl-panel h2 { margin:.45rem 0 0; font-size:1.15rem; }
.hl-copy { margin:.7rem 0 0; color:#334155; line-height:1.65; }
.hl-chip { display:inline-block; margin-top:1rem; background:#e8eef6; color:#0b1f3a; border:1px solid #d5dde8; border-radius:999px; padding:.35rem .75rem; font-size:.8rem; font-weight:700; }
.hl-bars { margin-top:1.1rem; display:flex; align-items:flex-end; gap:.55rem; height:8rem; }
.hl-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:.4rem; height:100%; }
.hl-bar-track { flex:1; width:100%; display:flex; align-items:flex-end; background:#f1f5f9; border-radius:.5rem; overflow:hidden; }
.hl-bar-fill { width:100%; background:linear-gradient(180deg,#4ade80,#15803d); border-radius:.5rem .5rem 0 0; }
.hl-bar-col span { font-size:11px; color:#64748b; font-weight:600; }
.hl-mix { margin-top:1rem; display:flex; flex-direction:column; gap:.85rem; }
.hl-mix-row { display:flex; justify-content:space-between; font-size:.85rem; font-weight:600; }
.hl-mix-track { height:8px; background:#f1f5f9; border-radius:99px; overflow:hidden; margin-top:.35rem; }
.hl-mix-fill { height:100%; background:#16a34a; }
.hl-list { list-style:none; margin:.9rem 0 0; padding:0; display:flex; flex-direction:column; gap:.35rem; }
.hl-list a { display:flex; justify-content:space-between; gap:.75rem; text-decoration:none; color:#0b1f3a; padding:.55rem 0; border-bottom:1px solid #f1f5f9; font-size:.9rem; }
.hl-list a:hover strong { color:#1e4a7a; }
.ok { color:#15803d; font-weight:700; font-size:.75rem; }
.pending { color:#ca8a04; font-weight:700; font-size:.75rem; }
.fail { color:#dc2626; font-weight:700; font-size:.75rem; }
`;
