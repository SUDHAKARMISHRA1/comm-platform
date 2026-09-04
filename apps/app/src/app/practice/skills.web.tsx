import { AppShell } from '@/components/app-shell';
import { spaNavigate } from '@/lib/spa-nav';
import { usePracticeBoard } from '@/coding/hooks/usePracticeBoard';

export default function PracticeSkillsScreen() {
  const board = usePracticeBoard();

  return (
    <AppShell>
      <div className="pr">
        <style>{css}</style>
        <a className="pr-more" href="/practice" onClick={(e) => spaNavigate('/practice', e)}>
          ← Practice
        </a>
        <header className="pr-head">
          <div>
            <p className="pr-kicker">Practice</p>
            <h1>All skills</h1>
            <p className="pr-lead">Pick a section created from admin to open its problem board.</p>
          </div>
        </header>
        {board.catalogQuery.isLoading ? <p className="pr-muted">Loading skills…</p> : null}
        {board.catalogQuery.error ? <p className="pr-err">Could not load skills.</p> : null}
        <section className="pr-tracks" aria-label="All skills">
          {board.skills.map((s) => {
            const count = board.skillCounts.get(s.id) ?? 0;
            return (
              <a
                key={s.id}
                className="pr-track"
                href={`/practice?skill=${encodeURIComponent(s.id)}`}
                onClick={(e) => spaNavigate(`/practice?skill=${encodeURIComponent(s.id)}`, e)}
              >
                <span className={`pr-track-mark pr-track-${s.slug}`}>{s.name.slice(0, 2).toUpperCase()}</span>
                <span className="pr-track-copy">
                  <strong>{s.name}</strong>
                  <em>{count} problem{count === 1 ? '' : 's'}</em>
                </span>
              </a>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}

const css = `
.pr { max-width:76rem; width:100%; margin:0 auto; padding:1rem 1rem 3rem; color:#111827; font-family:'Inter',system-ui,-apple-system,sans-serif; display:flex; flex-direction:column; gap:1.15rem; box-sizing:border-box; }
.pr-kicker { margin:0; font-size:11px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#6366f1; }
.pr h1 { margin:.35rem 0 0; font-size:clamp(1.4rem,3vw,1.85rem); letter-spacing:-.03em; }
.pr-lead { margin:.45rem 0 0; max-width:36rem; color:#6b7280; line-height:1.6; font-size:.95rem; }
.pr-more { font-size:.85rem; font-weight:700; color:#6366f1; text-decoration:none; }
.pr-muted { margin:0; color:#6b7280; font-size:.875rem; }
.pr-err { margin:0; color:#b91c1c; }
.pr-tracks { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.75rem; }
@media (max-width:700px) { .pr-tracks { grid-template-columns:1fr; } }
.pr-track { display:flex; align-items:center; gap:.85rem; text-align:left; border:1px solid #e5e7eb; background:#fff; border-radius:.75rem; padding:.9rem 1rem; text-decoration:none; color:inherit; box-shadow:0 1px 2px rgb(0 0 0/.05); }
.pr-track:hover { border-color:#c7d2fe; }
.pr-track-mark { width:2.4rem; height:2.4rem; border-radius:.6rem; display:grid; place-items:center; font-size:.75rem; font-weight:800; color:#fff; flex-shrink:0; background:#6366f1; }
.pr-track-copy { display:flex; flex-direction:column; min-width:0; }
.pr-track-copy strong { font-size:1rem; color:#111827; }
.pr-track-copy em { font-style:normal; color:#6b7280; font-size:.78rem; margin-top:.15rem; }
`;
