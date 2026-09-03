import { AppShell } from '@/components/app-shell';
import { VoteButton } from '@/coding/components/VoteButton';
import { spaNavigate } from '@/lib/spa-nav';
import { DIFFICULTIES, usePracticeBoard } from '@/coding/hooks/usePracticeBoard';
import type { Difficulty, QuestionStatus, QuestionSummary } from '@comm-platform/coding';

const STATUS_LABEL: Record<string, string> = {
  ALL: 'All status',
  SOLVED: 'Solved',
  ATTEMPTED: 'Attempted',
  NOT_ATTEMPTED: 'Not attempted',
};

const DIFF_META: Record<Difficulty, { label: string; hint: string }> = {
  EASY: { label: 'Easy', hint: 'Warm-up problems' },
  MEDIUM: { label: 'Medium', hint: 'Interview staples' },
  HARD: { label: 'Hard', hint: 'Stretch problems' },
};

export default function PracticeScreen() {
  const board = usePracticeBoard();
  const skillName = board.selectedSkill?.name ?? 'Java';

  return (
    <AppShell>
      <div className="pr">
        <style>{css}</style>

        <header className="pr-head">
          <div>
            <p className="pr-kicker">Practice</p>
            <h1>Build fluency, one problem at a time</h1>
            <p className="pr-lead">
              Pick a language track, then work interview picks and difficulty boards for that section.
            </p>
          </div>
          <label className="pr-search">
            <span className="pr-search-icon" aria-hidden />
            <input
              value={board.search}
              onChange={(e) => board.setSearch(e.target.value)}
              placeholder="Search problems"
              aria-label="Search problems"
            />
          </label>
        </header>

        {board.maintenanceMessage ? <p className="pr-warn">{board.maintenanceMessage}</p> : null}
        {board.authLoading || board.catalogQuery.isLoading ? <p className="pr-muted">Loading catalog…</p> : null}
        {board.catalogQuery.error ? <p className="pr-err">Could not load practice catalog.</p> : null}

        <section className="pr-tracks" aria-label="Language sections">
          {board.skills.map((s) => {
            const active = s.id === board.skill;
            const count = board.skillCounts.get(s.id) ?? 0;
            return (
              <button
                key={s.id}
                type="button"
                className={`pr-track ${active ? 'pr-track-active' : ''}`}
                onClick={() => board.selectSkill(s.id)}
              >
                <span className={`pr-track-mark pr-track-${s.slug}`}>{s.name.slice(0, 2).toUpperCase()}</span>
                <span className="pr-track-copy">
                  <strong>{s.name}</strong>
                  <em>{count} problem{count === 1 ? '' : 's'}</em>
                </span>
              </button>
            );
          })}
        </section>

        <section className="pr-stats" aria-label={`${skillName} progress`}>
          <article><span>In {skillName}</span><strong>{board.stats.total}</strong></article>
          <article><span>Solved</span><strong>{board.stats.solved}</strong></article>
          <article><span>In progress</span><strong>{board.stats.attempted}</strong></article>
        </section>

        <section className="pr-card">
          <div className="pr-card-head">
            <div>
              <p className="pr-kicker">Interview picks</p>
              <h2>Top problems asked right now · {skillName}</h2>
            </div>
            <div className="pr-card-actions">
              <p className="pr-muted">Ranked by interview votes from this track.</p>
              <a
                className="pr-more"
                href={`/practice/voted?skill=${encodeURIComponent(board.skill)}`}
                onClick={(e) => spaNavigate(`/practice/voted?skill=${encodeURIComponent(board.skill)}`, e)}
              >
                View more
              </a>
            </div>
          </div>
          {board.sectionQuery.isLoading ? <p className="pr-muted">Loading interview picks…</p> : null}
          {board.picks.length === 0 && !board.sectionQuery.isLoading ? (
            <p className="pr-empty">No interview votes in {skillName} yet. Use the vote control on a problem if you saw it in a recent interview.</p>
          ) : (
            <ol className="pr-picks">
              {board.picks.map((q, i) => (
                <li key={q.id}>
                  <a href={`/practice/${q.id}`} onClick={(e) => spaNavigate(`/practice/${q.id}`, e)}>
                    <span className="pr-rank">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pr-pick-body">
                      <strong>{q.title}</strong>
                      <em>{q.topics.slice(0, 2).join(' · ') || 'General'}</em>
                    </span>
                    <span className={`pr-diff pr-diff-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    <span className={`pr-status ${statusClass(q.status)}`}>{statusLabel(q.status)}</span>
                  </a>
                  <VoteButton questionId={q.id} voteCount={q.voteCount} votedByMe={q.votedByMe} />
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="pr-filters" aria-label="Problem filters">
          <label>
            <span>Level</span>
            <select value={board.level} onChange={(e) => board.setLevel(e.target.value)}>
              <option value="">All levels</option>
              {board.levels.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Topic</span>
            <select value={board.topic} onChange={(e) => board.setTopic(e.target.value)}>
              <option value="">All topics</option>
              {board.topics.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select value={board.status} onChange={(e) => board.setStatus(e.target.value as typeof board.status)}>
              {(['ALL', 'SOLVED', 'ATTEMPTED', 'NOT_ATTEMPTED'] as const).map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
          </label>
          <button type="button" className="pr-reset" onClick={board.resetFilters} disabled={!board.filtersActive}>
            Reset
          </button>
        </section>

        {board.boardQuery.isLoading ? <p className="pr-muted">Updating problem boards…</p> : null}
        {board.boardQuery.error ? <p className="pr-err">Could not load problems.</p> : null}

        <section className="pr-boards">
          {DIFFICULTIES.map((diff) => {
            const rows = board.grouped[diff];
            const open = board.expanded === diff;
            const shown = open ? rows : rows.slice(0, 3);
            const meta = DIFF_META[diff];
            return (
              <article key={diff} className="pr-board">
                <div className="pr-board-head">
                  <div>
                    <h3>
                      <span className={`pr-dot pr-diff-${diff.toLowerCase()}`} />
                      {meta.label}
                    </h3>
                    <p>{meta.hint} · {rows.length}</p>
                  </div>
                  {rows.length > 3 ? (
                    <button type="button" className="pr-viewall" onClick={() => board.viewAll(diff)}>
                      {open ? 'Show less' : 'View all'}
                    </button>
                  ) : (
                    <button type="button" className="pr-viewall" onClick={() => board.viewAll(diff)}>
                      View all
                    </button>
                  )}
                </div>
                {shown.length === 0 ? (
                  <p className="pr-empty">No {meta.label.toLowerCase()} problems match these filters.</p>
                ) : (
                  <ul>
                    {shown.map((q) => (
                      <li key={q.id}>
                        <ProblemRow q={q} />
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}

function ProblemRow({ q }: { q: QuestionSummary }) {
  return (
    <div className="pr-row">
      <a href={`/practice/${q.id}`} onClick={(e) => spaNavigate(`/practice/${q.id}`, e)}>
        <strong>{q.title}</strong>
        <span>
          {q.topics[0] ?? 'General'}
          {' · '}
          <em className={statusClass(q.status)}>{statusLabel(q.status)}</em>
        </span>
      </a>
      <VoteButton questionId={q.id} voteCount={q.voteCount} votedByMe={q.votedByMe} />
    </div>
  );
}

function statusLabel(status: QuestionStatus) {
  if (status === 'SOLVED') return 'Solved';
  if (status === 'ATTEMPTED') return 'Attempted';
  return 'Not started';
}

function statusClass(status: QuestionStatus) {
  if (status === 'SOLVED') return 'ok';
  if (status === 'ATTEMPTED') return 'pending';
  return 'idle';
}

const css = `
.pr { max-width:76rem; width:100%; margin:0 auto; padding:1rem 1rem 3rem; color:#111827; font-family:'Inter',system-ui,-apple-system,sans-serif; display:flex; flex-direction:column; gap:1.15rem; box-sizing:border-box; }
@media (min-width:768px) { .pr { padding:1.5rem 1.25rem 3.5rem; gap:1.35rem; } }
.pr-head { display:flex; flex-wrap:wrap; gap:1rem; justify-content:space-between; align-items:flex-end; }
.pr-kicker { margin:0; font-size:11px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#6366f1; }
.pr h1 { margin:.35rem 0 0; font-size:clamp(1.4rem,3vw,1.85rem); letter-spacing:-.03em; }
.pr-lead { margin:.45rem 0 0; max-width:36rem; color:#6b7280; line-height:1.6; font-size:.95rem; }
.pr-search { display:flex; align-items:center; gap:.5rem; width:min(100%, 280px); height:40px; padding:0 .85rem; border:1px solid #e5e7eb; border-radius:.5rem; background:#fff; box-shadow:0 1px 2px rgb(0 0 0/.04); }
.pr-search:focus-within { border-color:#c7d2fe; box-shadow:0 0 0 3px #eef2ff; }
.pr-search input { border:0; outline:none; width:100%; font:inherit; font-size:.875rem; background:transparent; color:#111827; }
.pr-search-icon { width:14px; height:14px; flex-shrink:0; background:#6b7280;
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 20.49 21.49 19l-5.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E") center / contain no-repeat;
  mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 20.49 21.49 19l-5.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E") center / contain no-repeat;
}
.pr-muted { margin:0; color:#6b7280; font-size:.875rem; }
.pr-warn { margin:0; color:#b45309; }
.pr-err { margin:0; color:#b91c1c; }
.pr-empty { margin:0; padding:.85rem 0; color:#6b7280; font-size:.875rem; }
.pr-tracks { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.75rem; }
@media (max-width:700px) { .pr-tracks { grid-template-columns:1fr; } }
.pr-track { display:flex; align-items:center; gap:.85rem; text-align:left; border:1px solid #e5e7eb; background:#fff; border-radius:.75rem; padding:.9rem 1rem; cursor:pointer; box-shadow:0 1px 2px rgb(0 0 0/.05); transition:transform .15s, box-shadow .15s, border-color .15s; }
.pr-track:hover { transform:translateY(-2px); border-color:#c7d2fe; box-shadow:0 10px 18px -8px rgb(99 102 241/.35); }
.pr-track-active { border-color:#6366f1; background:#eef2ff; box-shadow:0 8px 16px -8px rgb(99 102 241/.45); }
.pr-track-mark { width:2.4rem; height:2.4rem; border-radius:.6rem; display:grid; place-items:center; font-size:.75rem; font-weight:800; color:#fff; flex-shrink:0; background:#6366f1; }
.pr-track-java { background:#6366f1; }
.pr-track-c { background:#0ea5e9; }
.pr-track-cpp { background:#1e293b; }
.pr-track-copy { display:flex; flex-direction:column; min-width:0; }
.pr-track-copy strong { font-size:1rem; color:#111827; }
.pr-track-copy em { font-style:normal; color:#6b7280; font-size:.78rem; margin-top:.15rem; }
.pr-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; }
@media (max-width:640px) { .pr-stats { grid-template-columns:1fr; } }
.pr-stats article { background:#fff; border:1px solid #e5e7eb; border-radius:.75rem; padding:.85rem 1rem; box-shadow:0 1px 2px rgb(0 0 0/.04); }
.pr-stats span { color:#6b7280; font-size:.78rem; }
.pr-stats strong { display:block; margin-top:.2rem; font-size:1.45rem; }
.pr-card { background:#fff; border:1px solid #e5e7eb; border-radius:.75rem; padding:1.1rem 1.15rem; box-shadow:0 1px 2px rgb(0 0 0/.04); }
.pr-card-head { display:flex; flex-wrap:wrap; gap:.75rem; justify-content:space-between; align-items:flex-end; margin-bottom:.75rem; }
.pr-card-actions { display:flex; flex-direction:column; align-items:flex-end; gap:.35rem; }
.pr-more { font-size:.85rem; font-weight:700; color:#6366f1; text-decoration:none; white-space:nowrap; }
.pr-more:hover { color:#4f46e5; }
.pr-card h2 { margin:.25rem 0 0; font-size:1.05rem; }
.pr-picks { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; }
.pr-picks li { display:flex; align-items:center; gap:.6rem; border-top:1px solid #f3f4f6; }
.pr-picks li:first-child { border-top:0; }
.pr-picks a { display:flex; align-items:center; gap:.75rem; padding:.7rem .15rem; text-decoration:none; color:inherit; flex:1; min-width:0; flex-wrap:wrap; }
.pr-picks a:hover strong { color:#6366f1; }
.pr-rank { width:1.75rem; font-size:.75rem; font-weight:800; color:#6366f1; }
.pr-pick-body { flex:1; min-width:0; }
.pr-pick-body strong { display:block; font-size:.95rem; }
.pr-pick-body em { display:block; font-style:normal; color:#6b7280; font-size:.75rem; margin-top:.15rem; }
.pr-diff { font-size:10px; font-weight:800; letter-spacing:.04em; padding:.2rem .5rem; border-radius:999px; flex-shrink:0; }
.pr-diff-easy { background:#dcfce7; color:#15803d; }
.pr-diff-medium { background:#fef3c7; color:#b45309; }
.pr-diff-hard { background:#fee2e2; color:#b91c1c; }
.pr-status { font-size:.75rem; font-weight:700; flex-shrink:0; }
.ok { color:#15803d; }
.pending { color:#b45309; }
.idle { color:#6b7280; }
.pr-filters { display:flex; flex-wrap:wrap; gap:.75rem; align-items:flex-end; background:#fff; border:1px solid #e5e7eb; border-radius:.75rem; padding:.9rem 1rem; }
.pr-filters label { display:flex; flex-direction:column; gap:.35rem; min-width:min(100%, 160px); flex:1; }
.pr-filters span { font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#6b7280; }
.pr-filters select { height:40px; border:1px solid #e5e7eb; border-radius:.5rem; background:#f9fafb; padding:0 .7rem; font:inherit; font-size:.875rem; color:#111827; }
.pr-reset { height:40px; padding:0 1rem; border:1px solid #e5e7eb; border-radius:.5rem; background:#fff; color:#374151; font-weight:700; font-size:.875rem; cursor:pointer; }
.pr-reset:hover:not(:disabled) { background:#f3f4f6; }
.pr-reset:disabled { opacity:.45; cursor:default; }
.pr-boards { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1rem; }
@media (max-width:900px) { .pr-boards { grid-template-columns:1fr; } }
.pr-board { background:#fff; border:1px solid #e5e7eb; border-radius:.75rem; padding:1rem; box-shadow:0 1px 2px rgb(0 0 0/.04); min-width:0; }
.pr-board-head { display:flex; justify-content:space-between; align-items:flex-start; gap:.75rem; margin-bottom:.7rem; }
.pr-board h3 { margin:0; display:flex; align-items:center; gap:.45rem; font-size:1rem; }
.pr-board p { margin:.2rem 0 0; color:#6b7280; font-size:.75rem; }
.pr-dot { width:8px; height:8px; border-radius:99px; display:inline-block; }
.pr-dot.pr-diff-easy { background:#22c55e; }
.pr-dot.pr-diff-medium { background:#f59e0b; }
.pr-dot.pr-diff-hard { background:#ef4444; }
.pr-viewall { border:0; background:transparent; color:#6366f1; font-weight:700; font-size:.8rem; cursor:pointer; padding:0; }
.pr-viewall:hover { color:#4f46e5; }
.pr-board ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.35rem; }
.pr-row { display:flex; align-items:flex-start; gap:.5rem; }
.pr-board a { display:block; text-decoration:none; color:inherit; border:1px solid #f3f4f6; background:#f9fafb; border-radius:.6rem; padding:.7rem .75rem; transition:border-color .12s, background .12s; flex:1; min-width:0; }
.pr-board a:hover { border-color:#c7d2fe; background:#eef2ff; }
.pr-board a strong { display:block; font-size:.875rem; }
.pr-board a span { display:block; margin-top:.2rem; color:#6b7280; font-size:.75rem; }
`;
