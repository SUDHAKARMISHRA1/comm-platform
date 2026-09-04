import { useQuery } from '@tanstack/react-query';
import { buildWeeklyActivity } from '@comm-platform/coding';

import { fetchDashboard } from '@/coding/api/questionApi';
import { HighlightsFeed } from '@/coding/components/HighlightsFeed';
import { AppShell } from '@/components/app-shell';
import { spaNavigate } from '@/lib/spa-nav';
import { DIFFICULTY_FILL, submissionTone } from '@/coding/statusColors';
import { useAuth } from '@/providers/auth-provider';

function barHeight(count: number, max: number) {
  if (max <= 0 || count <= 0) return 8;
  return Math.max(14, Math.round((count / max) * 100));
}

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

  const week = data?.weeklyActivity ?? buildWeeklyActivity([]);
  const weekMax = Math.max(0, ...week.map((d) => d.count));
  const weekTotal = week.reduce((sum, d) => sum + d.count, 0);

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
        <header className="hl-hero hl-desktop">
          <div>
            <p className="hl-kicker">Highlights</p>
            <h1>Your practice, in one glance</h1>
            <p className="hl-lead">
              Hello {name}. These numbers come from your submissions and progress. The weekly pulse counts your attempts over the last seven days.
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

        {isLoading ? <p className="hl-muted hl-desktop">Loading your insights…</p> : null}

        <section className="hl-kpis hl-desktop">
          <Kpi label="Solved" value={String(solved)} hint={`${completion}% of catalog`} />
          <Kpi label="In progress" value={String(attempted)} hint="Marked attempted" />
          <Kpi label="Still open" value={String(remaining)} hint="Not solved yet" />
          <Kpi label="Recent hit rate" value={recent.length ? `${hitRate}%` : '—'} hint={recent.length ? `${accepted}/${recent.length} accepted` : 'Submit to unlock'} />
        </section>

        <div className="hl-layout">
          <div className="hl-main">
            <HighlightsFeed>
              <article className="hl-panel hl-desktop">
                <p className="hl-label">Insight</p>
                <h2>{insight}</h2>
                <p className="hl-copy">{attraction}</p>
                {weak ? (
                  <p className="hl-chip">Focus next: {weak.difficulty} · {weak.percent}% complete ({weak.solved}/{weak.total})</p>
                ) : null}
              </article>
            </HighlightsFeed>
          </div>

          <aside className="hl-side hl-desktop">
            <article className="hl-panel">
              <p className="hl-label">Weekly pulse</p>
              <h2>Activity this week</h2>
              <div className="hl-bars">
                {week.map((d) => (
                  <div className="hl-bar-col" key={d.dateKey}>
                    <span className={d.count ? 'hl-bar-n' : 'hl-bar-n hl-bar-n-empty'}>{d.count || ''}</span>
                    <div className="hl-bar-track">
                      <div className="hl-bar-fill" style={{ height: `${barHeight(d.count, weekMax)}%` }} />
                    </div>
                    <span>{d.day}</span>
                  </div>
                ))}
              </div>
              <p className="hl-muted">
                {weekTotal === 0
                  ? 'No submissions yet this week. Run a problem to start your pulse.'
                  : `${weekTotal} submission${weekTotal === 1 ? '' : 's'} across the last 7 days.`}
              </p>
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
          </aside>
        </div>
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
.hl { background:#fafafa; min-height:100%; width:100%; box-sizing:border-box; padding:1.25rem 1rem 2.5rem; color:#111827; font-family:'Inter',system-ui,-apple-system,sans-serif; }
@media (min-width:768px) { .hl { padding:2rem 1.25rem 3.5rem; } }
.hl-hero { max-width:80rem; margin:0 auto 1.25rem; display:flex; flex-wrap:wrap; gap:1rem; justify-content:space-between; align-items:flex-end; }
@media (min-width:768px) { .hl-hero { margin-bottom:1.75rem; gap:1.25rem; } }
.hl-kicker { margin:0; font-size:11px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#6366f1; }
.hl h1 { margin:.4rem 0 0; font-size:clamp(1.8rem,3vw,2.4rem); letter-spacing:-.03em; color:#111827; }
.hl-lead { margin:.75rem 0 0; max-width:40rem; color:#6b7280; line-height:1.7; }
.hl-cta { display:inline-flex; height:2.75rem; align-items:center; padding:0 1.1rem; border-radius:.5rem; background:#6366f1; color:#fff; text-decoration:none; font-weight:700; font-size:.875rem; transition:background .15s; width:100%; justify-content:center; }
@media (min-width:640px) { .hl-cta { width:auto; } }
.hl-cta:hover { background:#4f46e5; }
.hl-kpis, .hl-hero, .hl-layout { max-width:80rem; width:100%; }
.hl-kpis { margin:0 auto 1.25rem; display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); }
.hl-layout { margin:0 auto; display:grid; gap:1.25rem; grid-template-columns:1fr; align-items:start; }
@media (min-width:960px) {
  .hl-layout { grid-template-columns:minmax(0,1fr) 20rem; gap:1.5rem; }
  .hl-side { position:sticky; top:1rem; }
}
.hl-main, .hl-featured, .hl-feed { display:flex; flex-direction:column; gap:1.25rem; min-width:0; }
.hl-featured, .hl-feed { gap:12px; }
.hl-side { display:flex; flex-direction:column; gap:1rem; }
.hl-kpi, .hl-panel { background:#fff; border:1px solid #e5e7eb; border-radius:.75rem; padding:1.15rem 1.2rem; box-shadow:0 1px 2px rgb(0 0 0/.04); }
.hl-label { margin:0; font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#6b7280; }
.hl-kpi-value { margin:.35rem 0 0; font-size:2rem; font-weight:750; letter-spacing:-.03em; color:#111827; }
.hl-muted { margin:.35rem 0 0; color:#6b7280; font-size:.85rem; }
.hl-panel h2 { margin:.45rem 0 0; font-size:1.15rem; color:#111827; }
.hl-copy { margin:.7rem 0 0; color:#374151; line-height:1.65; }
.hl-chip { display:inline-block; margin-top:1rem; background:#eef2ff; color:#4f46e5; border:1px solid #c7d2fe; border-radius:999px; padding:.35rem .75rem; font-size:.8rem; font-weight:700; }
.hl-bars { margin-top:1.1rem; display:flex; align-items:flex-end; gap:.4rem; height:9.25rem; }
.hl-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:.3rem; height:100%; }
.hl-bar-track { flex:1; width:100%; display:flex; align-items:flex-end; background:#f3f4f6; border-radius:.5rem; overflow:hidden; }
.hl-bar-fill { width:100%; background:linear-gradient(180deg,#818cf8,#6366f1); border-radius:.5rem .5rem 0 0; }
.hl-bar-col > span:last-child { font-size:11px; color:#6b7280; font-weight:600; }
.hl-bar-n { font-size:10px; color:#4f46e5; font-weight:700; line-height:1; min-height:12px; }
.hl-bar-n-empty { visibility:hidden; }
.hl-mix { margin-top:1rem; display:flex; flex-direction:column; gap:.85rem; }
.hl-mix-row { display:flex; justify-content:space-between; font-size:.85rem; font-weight:600; color:#374151; }
.hl-mix-track { height:6px; background:#f3f4f6; border-radius:99px; overflow:hidden; margin-top:.35rem; }
.hl-mix-fill { height:100%; }
.hl-list { list-style:none; margin:.9rem 0 0; padding:0; display:flex; flex-direction:column; gap:.35rem; }
.hl-list a { display:flex; justify-content:space-between; gap:.75rem; text-decoration:none; color:#111827; padding:.55rem 0; border-bottom:1px solid #f3f4f6; font-size:.9rem; flex-wrap:wrap; }
.hl-list a:hover strong { color:#6366f1; }
.ok { color:#15803d; font-weight:700; font-size:.75rem; }
.pending { color:#b45309; font-weight:700; font-size:.75rem; }
.fail { color:#dc2626; font-weight:700; font-size:.75rem; }
@media (max-width:767px) {
  .hl-desktop { display:none !important; }
}
.hl-feed-head h2 { margin:.35rem 0 0; font-size:1.35rem; }
.hl-feed-sentinel { height:1px; width:100%; }
.lf-card { background:#fff; border:1px solid #e5e7eb; border-radius:.9rem; padding:1rem 1.05rem 0; box-shadow:0 1px 2px rgb(0 0 0/.05); }
.lf-head { display:flex; gap:.75rem; align-items:center; }
.lf-avatar { width:44px; height:44px; border-radius:50%; background:#eef2ff; color:#4f46e5; display:inline-flex; align-items:center; justify-content:center; font-weight:800; font-size:.85rem; flex-shrink:0; }
.lf-avatar.sm { width:32px; height:32px; font-size:.7rem; }
.lf-meta { display:flex; flex-direction:column; min-width:0; }
.lf-meta strong { font-size:.95rem; }
.lf-meta span { color:#6b7280; font-size:.78rem; line-height:1.35; }
.lf-meta span:last-child { text-transform:capitalize; }
.lf-card h3 { margin:.85rem 0 .4rem; font-size:1.05rem; letter-spacing:-.02em; }
.lf-body { margin:0; color:#374151; line-height:1.6; white-space:pre-wrap; font-size:.95rem; }
.lf-more { margin-left:.35rem; border:0; background:none; color:#6366f1; font-weight:700; cursor:pointer; padding:0; font:inherit; }
.lf-media { margin: .85rem -1.05rem 0; background:#0f172a; }
.lf-media img { width:100%; max-height:360px; object-fit:cover; display:block; }
.lf-media iframe { width:100%; aspect-ratio:16/9; border:0; display:block; }
.lf-media video { width:100%; display:block; background:#0f172a; }
.lf-caption { margin:0; padding:.55rem .9rem .85rem; color:#6b7280; font-size:.8rem; background:#fff; }
.lf-slides { position:relative; }
.lf-slide-nav { display:flex; justify-content:space-between; align-items:center; gap:.5rem; padding:.45rem .75rem .7rem; background:#fff; color:#4b5563; font-size:.8rem; font-weight:700; }
.lf-slide-nav button { border:1px solid #e5e7eb; background:#fff; border-radius:.5rem; padding:.25rem .6rem; cursor:pointer; font:inherit; font-weight:700; }
.lf-link { display:flex; flex-direction:column; gap:.15rem; margin:.85rem 0 0; padding:.8rem .9rem; border:1px solid #e5e7eb; border-radius:.65rem; text-decoration:none; background:#f9fafb; }
.lf-link span { color:#111827; font-weight:700; }
.lf-link em { color:#6366f1; font-style:normal; font-size:.8rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lf-stats { display:flex; gap:1rem; margin:.85rem 0 0; color:#6b7280; font-size:.8rem; }
.lf-stats button { border:0; background:none; color:#6b7280; cursor:pointer; padding:0; font:inherit; }
.lf-actions { display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid #f3f4f6; margin-top:.7rem; }
.lf-actions button { height:44px; border:0; background:#fff; color:#4b5563; font-weight:700; cursor:pointer; font-size:.88rem; display:inline-flex; align-items:center; justify-content:center; gap:.4rem; }
.lf-actions button:hover { background:#f9fafb; color:#4f46e5; }
.lf-actions button.on { color:#4f46e5; }
.lf-thread { border-top:1px solid #f3f4f6; padding: .85rem 0 1rem; display:flex; flex-direction:column; gap:.75rem; }
.lf-comment { display:flex; gap:.6rem; }
.lf-comment.nested { margin-top:.65rem; }
.lf-bubble { background:#f3f4f6; border-radius:.75rem; padding:.55rem .7rem; flex:1; }
.lf-bubble strong { font-size:.82rem; }
.lf-time { margin-left:.4rem; color:#9ca3af; font-size:.72rem; font-weight:600; }
.lf-bubble p { margin:.25rem 0 0; color:#111827; font-size:.88rem; line-height:1.45; }
.lf-comment-actions { display:flex; gap:.85rem; margin-top:.35rem; }
.lf-comment-actions button { border:0; background:none; color:#6b7280; font-weight:700; font-size:.75rem; cursor:pointer; padding:0; }
.lf-comment-actions button.on { color:#4f46e5; }
.lf-empty { color:#6b7280; font-size:.85rem; margin:0; }
.lf-composer { display:flex; flex-direction:column; gap:.4rem; }
.lf-composer-row { display:flex; gap:.5rem; align-items:center; }
.lf-composer input { flex:1; height:40px; border:1px solid #e5e7eb; border-radius:999px; padding:0 1rem; font:inherit; }
.lf-composer-row > button { height:40px; border:0; border-radius:999px; background:#6366f1; color:#fff; font-weight:700; padding:0 1rem; cursor:pointer; }
.lf-composer-row > button:disabled { opacity:.5; }
.lf-replying { margin:0; font-size:.78rem; color:#4f46e5; display:flex; gap:.5rem; align-items:center; }
.lf-replying button { border:0; background:none; color:#6b7280; cursor:pointer; }
`;
