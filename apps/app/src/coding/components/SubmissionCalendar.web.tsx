import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import type { SubmissionSummary } from '@comm-platform/coding';

import {
  formatDayLabel,
  groupSubmissionsByDay,
  intensity,
  monthCells,
  periodStats,
  type DayInsight,
} from '@/coding/activity';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FILL = ['#f9fafb', '#ddd6fe', '#a78bfa', '#7c3aed', '#4c1d95'];
const INK = ['#6b7280', '#4c1d95', '#4c1d95', '#ffffff', '#ffffff'];
const TIP_W = 280;

type TipState = {
  dateKey: string;
  insight?: DayInsight;
  left: number;
  top: number;
  place: 'above' | 'below';
};

export function SubmissionCalendar({ submissions }: { submissions: SubmissionSummary[] }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [tip, setTip] = useState<TipState | null>(null);
  const byDay = useMemo(() => groupSubmissionsByDay(submissions), [submissions]);
  const stats = useMemo(() => periodStats(submissions, now), [submissions]);
  const cells = monthCells(cursor.year, cursor.month);
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  function shift(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    setTip(null);
  }

  function showTip(event: MouseEvent<HTMLDivElement>, dateKey: string, insight?: DayInsight) {
    const rect = event.currentTarget.getBoundingClientRect();
    const place: 'above' | 'below' = rect.top > 180 ? 'above' : 'below';
    const half = TIP_W / 2;
    const left = Math.min(Math.max(rect.left + rect.width / 2, half + 8), window.innerWidth - half - 8);
    const top = place === 'above' ? rect.top - 8 : rect.bottom + 8;
    setTip({ dateKey, insight, left, top, place });
  }

  return (
    <section className="cal">
      <style>{css}</style>
      <div className="cal-head">
        <div>
          <p className="cal-kicker">Submission activity</p>
          <h2>Daily, monthly, and yearly commits</h2>
        </div>
        <div className="cal-nav">
          <button type="button" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
          <strong>{monthLabel}</strong>
          <button type="button" onClick={() => shift(1)} aria-label="Next month">›</button>
        </div>
      </div>
      <div className="cal-kpis">
        <article>
          <span>Today</span>
          <strong>{stats.today}</strong>
          <em>{stats.todayAccepted} accepted</em>
        </article>
        <article>
          <span>This month</span>
          <strong>{stats.monthCount}</strong>
          <em>{stats.monthAccepted} accepted</em>
        </article>
        <article>
          <span>This year</span>
          <strong>{stats.yearCount}</strong>
          <em>{stats.activeDaysThisYear} active days</em>
        </article>
      </div>
      <div className="cal-week">
        {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="cal-grid">
        {cells.map((cell, i) => {
          if (!cell.day || !cell.dateKey) {
            return <div key={`e-${i}`} className="cal-empty" />;
          }
          const insight = byDay.get(cell.dateKey);
          const count = insight?.count ?? 0;
          const level = intensity(count);
          return (
            <div
              key={cell.dateKey}
              className="cal-day"
              style={{ background: FILL[level], color: INK[level], borderColor: count ? FILL[Math.min(4, level + 1)] : '#e5e7eb' }}
              onMouseEnter={(e) => showTip(e, cell.dateKey!, insight)}
              onMouseLeave={() => setTip(null)}
            >
              <span className="cal-num">{cell.day}</span>
              {count > 0 ? <span className="cal-count">{count}</span> : null}
            </div>
          );
        })}
      </div>
      <p className="cal-legend">
        <span>Fewer</span>
        {FILL.map((c, i) => <i key={c} style={{ background: c, borderColor: i === 0 ? '#e2e8f0' : c }} />)}
        <span>More submissions</span>
      </p>
      {tip ? (
        <div
          className={`cal-tip cal-tip-${tip.place}`}
          style={{ left: tip.left, top: tip.top }}
          role="tooltip"
        >
          <p className="cal-tip-date">{formatDayLabel(tip.dateKey)}</p>
          {tip.insight ? (
            <>
              <p>
                <b>{tip.insight.count}</b> submission{tip.insight.count === 1 ? '' : 's'} · <b>{tip.insight.accepted}</b> accepted
                {' '}({Math.round((tip.insight.accepted / tip.insight.count) * 100)}% hit rate)
              </p>
              <p>
                <b>{tip.insight.uniqueProblems.length}</b> problem{tip.insight.uniqueProblems.length === 1 ? '' : 's'}:{' '}
                {tip.insight.uniqueProblems.slice(0, 4).join(', ')}
                {tip.insight.uniqueProblems.length > 4 ? '…' : ''}
              </p>
              <p>Languages: {tip.insight.languages.join(', ')}</p>
            </>
          ) : (
            <p>No submissions this day.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}

const css = `
.cal { width: 100%; background:#fff; border:1px solid #e5e7eb; border-radius:.75rem; padding:.9rem 1rem .75rem; overflow: visible; box-shadow:0 1px 2px rgb(0 0 0/.04); font-family:'Inter',system-ui,-apple-system,sans-serif; }
.cal-head { display:flex; flex-wrap:wrap; gap:.75rem; justify-content:space-between; align-items:flex-end; }
@media (max-width:640px) {
  .cal { padding:.75rem; }
  .cal-nav { width:100%; justify-content:space-between; }
  .cal-tip { width:min(92vw,280px); margin-left:0; left:50% !important; transform:translateX(-50%); }
  .cal-tip-above { transform:translate(-50%, -100%); }
}
.cal-kicker { margin:0; font-size:11px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#6366f1; }
.cal h2 { margin:.25rem 0 0; font-size:1.05rem; color:#111827; }
.cal-nav { display:flex; align-items:center; gap:.5rem; }
.cal-nav button { width:1.75rem; height:1.75rem; border-radius:999px; border:1px solid #e5e7eb; background:#f9fafb; color:#374151; cursor:pointer; transition:background .12s; }
.cal-nav button:hover { background:#eef2ff; border-color:#c7d2fe; color:#6366f1; }
.cal-kpis { margin:.7rem 0 .55rem; display:grid; grid-template-columns:repeat(3,1fr); gap:.5rem; }
@media (max-width:700px) { .cal-kpis { grid-template-columns:1fr; } }
.cal-kpis article { border:1px solid #e5e7eb; border-radius:.5rem; padding:.45rem .7rem; background:#f9fafb; display:flex; align-items:baseline; gap:.6rem; }
.cal-kpis span { font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#6b7280; }
.cal-kpis strong { font-size:1.15rem; color:#111827; }
.cal-kpis em { font-style:normal; color:#6b7280; font-size:.75rem; margin-left:auto; }
.cal-week, .cal-grid { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:4px; }
.cal-week span { text-align:center; font-size:10px; font-weight:700; color:#6b7280; padding-bottom:2px; }
.cal-empty { height: 34px; }
.cal-day { height: 34px; border-radius:6px; border:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center; gap:.3rem; cursor:default; }
.cal-day:hover { outline: 2px solid #6366f1; outline-offset: 0; z-index: 1; }
.cal-num { font-weight:700; font-size:.78rem; line-height:1; }
.cal-count { font-size:10px; font-weight:700; opacity:.85; min-width:1.1rem; text-align:center; }
.cal-tip { position:fixed; z-index:80; width:280px; margin-left:-140px; background:#1e293b; color:#e2e8f0; padding:.7rem .8rem; border-radius:.5rem; pointer-events:none; box-shadow:0 10px 15px -3px rgb(0 0 0/.2); }
.cal-tip-above { transform: translateY(-100%); }
.cal-tip p { margin:.22rem 0 0; font-size:.78rem; line-height:1.4; }
.cal-tip-date { margin:0 !important; color:#f9fafb; font-weight:700; font-size:.75rem !important; }
.cal-legend { display:flex; align-items:center; gap:.3rem; margin:.55rem 0 0; color:#6b7280; font-size:.72rem; }
.cal-legend i { width:12px; height:12px; border-radius:3px; border:1px solid; display:inline-block; }
`;
