import { AppShell } from '@/components/app-shell';

const activity = [
  { initial: 'M', name: 'Maya Chen', detail: 'Shared an update in Product design', time: 'Just now', color: '#eef2ff', text: '#4f46e5' },
  { initial: 'R', name: 'Rohan Patel', detail: 'Started a team discussion', time: '18 min ago', color: '#f0fdf4', text: '#15803d' },
  { initial: 'A', name: 'Amelia Ross', detail: 'Joined the Launch workspace', time: '1 hr ago', color: '#fef3c7', text: '#b45309' },
];

const highlights = [
  {
    title: 'Conversations that stay organised',
    description: 'Bring people together in focused spaces, with a clear place for every update and decision.',
  },
  {
    title: 'Made for every screen',
    description: 'Start in your browser and continue seamlessly on mobile when the app launches on Android and iOS.',
  },
  {
    title: 'A calm, private workspace',
    description: 'Simple controls and thoughtful defaults help teams communicate with clarity and confidence.',
  },
];

export default function HomeScreen() {
  return (
    <AppShell>
      <div className="cp-home">
        <style>{homeCss}</style>
        <section className="cp-hero">
          <div className="cp-hero-glow" />
          <div className="cp-hero-grid">
            <div className="cp-copy">
              <p className="cp-pill">
                <span className="cp-pill-dot" />
                CONNECT WITH CLARITY
              </p>
              <h1>A better home for the conversations that move work forward.</h1>
              <p className="cp-lead">
                Comm Platform brings updates, people, and shared momentum into one simple, dependable place.
              </p>
              <div className="cp-actions">
                <a href="/signup" className="cp-btn-dark">
                  Create your account <span aria-hidden>→</span>
                </a>
                <a href="#updates" className="cp-btn-light">
                  Explore updates
                </a>
              </div>
              <p className="cp-fine">A simple start today. More collaborative tools on the way.</p>
            </div>

            <div className="cp-preview-wrap">
              <div className="cp-preview">
                <div className="cp-preview-head">
                  <div>
                    <p className="cp-kicker">Your workspace</p>
                    <h2>Good morning, Alex</h2>
                  </div>
                  <span className="cp-avatar">A</span>
                </div>
                <div className="cp-workspace">
                  <div className="cp-workspace-row">
                    <div>
                      <p className="cp-workspace-name">Launch workspace</p>
                      <p className="cp-subtle">8 members · Active now</p>
                    </div>
                    <span className="cp-live">Live</span>
                  </div>
                  <div className="cp-progress">
                    <div className="cp-progress-fill" />
                  </div>
                </div>
                <div className="cp-activity">
                  {activity.map((item) => (
                    <div className="cp-activity-row" key={item.name}>
                      <span className="cp-activity-avatar" style={{ background: item.color, color: item.text }}>
                        {item.initial}
                      </span>
                      <div className="cp-activity-copy">
                        <p>{item.name}</p>
                        <p className="cp-subtle">{item.detail}</p>
                      </div>
                      <span className="cp-time">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cp-updates" id="updates">
          <div className="cp-updates-inner">
            <p className="cp-section-label">WHAT&apos;S HAPPENING</p>
            <h2>A place built around progress.</h2>
            <p className="cp-lead">These are placeholder updates for now. They can later come from your admin-managed content system.</p>
            <div className="cp-cards">
              {highlights.map((item, index) => (
                <article className="cp-card" key={item.title}>
                  <span className="cp-card-index">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cp-cta-wrap">
          <div className="cp-cta">
            <p className="cp-cta-label">READY WHEN YOU ARE</p>
            <h2>Start with one conversation. Build from there.</h2>
            <p>Create your account and see the product app in action.</p>
            <a href="/signup" className="cp-btn-navy">
              Sign up for Comm Platform
            </a>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

const homeCss = `
.cp-home { background:#fafafa; color:#111827; min-height:100%; width:100%; box-sizing:border-box; font-family:'Inter',system-ui,-apple-system,sans-serif; }
.cp-hero { position:relative; isolation:isolate; overflow:hidden; }
.cp-hero-glow { position:absolute; inset:0 0 auto; height:34rem; z-index:-1; pointer-events:none;
  background: radial-gradient(circle at 75% 0%, rgba(238,242,255,.95), transparent 32%),
              radial-gradient(circle at 15% 20%, rgba(99,102,241,.08), transparent 31%); }
.cp-hero-grid { max-width:80rem; margin:0 auto; padding:2.5rem 1rem 3rem; display:grid; gap:2rem; align-items:center; }
@media (min-width:768px) { .cp-hero-grid { padding:4rem 1.25rem 5rem; gap:3.5rem; } }
@media (min-width:1024px) { .cp-hero-grid { grid-template-columns:1.05fr .95fr; gap:5rem; padding:6rem 2.5rem 7rem; } }
.cp-copy { max-width:40rem; }
.cp-pill { display:inline-flex; align-items:center; gap:.5rem; border:1px solid #e0e7ff; background:#eef2ff;
  padding:.35rem .75rem; border-radius:999px; font-size:11px; font-weight:700; letter-spacing:.08em; color:#4f46e5; box-shadow:0 1px 2px rgb(0 0 0/.05); }
.cp-pill-dot { width:6px; height:6px; border-radius:99px; background:#6366f1; }
.cp-copy h1 { margin:1.25rem 0 0; font-size:clamp(2rem,4vw,3.6rem); line-height:1.08; letter-spacing:-.045em; font-weight:650; color:#111827; }
.cp-lead { margin:1.25rem 0 0; max-width:36rem; font-size:1.125rem; line-height:1.8; color:#6b7280; }
.cp-actions { margin-top:2rem; display:flex; flex-wrap:wrap; gap:.75rem; }
.cp-btn-dark { display:inline-flex; height:3rem; align-items:center; justify-content:center; border-radius:.5rem; background:#6366f1; color:#fff; padding:0 1.25rem; font-size:.875rem; font-weight:700; text-decoration:none; box-shadow:0 4px 6px -1px rgb(99 102 241/.25); transition:background .15s,transform .15s; }
.cp-btn-dark:hover { background:#4f46e5; transform:translateY(-1px); }
.cp-btn-light { display:inline-flex; height:3rem; align-items:center; justify-content:center; border-radius:.5rem; border:1px solid #e5e7eb; background:#ffffff; color:#111827; padding:0 1.25rem; font-size:.875rem; font-weight:700; text-decoration:none; transition:border-color .15s,background .15s; }
.cp-btn-light:hover { border-color:#d1d5db; background:#f9fafb; }
.cp-fine { margin-top:1.1rem; font-size:.875rem; color:#6b7280; }
.cp-preview-wrap { border-radius:.75rem; border:1px solid #e5e7eb; background:#fff; padding:.75rem; box-shadow:0 10px 15px -3px rgb(0 0 0/.08), 0 4px 6px -4px rgb(0 0 0/.05); }
.cp-preview { border-radius:.625rem; border:1px solid #e5e7eb; background:#f9fafb; padding:1.15rem; }
.cp-preview-head { display:flex; align-items:center; justify-content:space-between; }
.cp-kicker { margin:0; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#6b7280; }
.cp-preview h2 { margin:.2rem 0 0; font-size:1.15rem; font-weight:700; color:#111827; }
.cp-avatar { width:2.5rem; height:2.5rem; border-radius:999px; background:#6366f1; color:#fff; display:grid; place-items:center; font-weight:700; font-size:.875rem; }
.cp-workspace { margin-top:1.4rem; border-radius:.625rem; background:#fff; padding:1rem; box-shadow:0 1px 2px rgb(0 0 0/.05); border:1px solid #e5e7eb; }
.cp-workspace-row { display:flex; justify-content:space-between; gap:1rem; align-items:center; }
.cp-workspace-name { margin:0; font-weight:700; color:#111827; }
.cp-subtle { margin:.25rem 0 0; font-size:.75rem; color:#6b7280; }
.cp-live { border-radius:999px; background:#dcfce7; color:#15803d; padding:.2rem .65rem; font-size:.75rem; font-weight:700; }
.cp-progress { margin-top:1rem; height:6px; overflow:hidden; border-radius:999px; background:#e5e7eb; }
.cp-progress-fill { height:100%; width:75%; border-radius:999px; background:#22c55e; }
.cp-activity { margin-top:1rem; display:flex; flex-direction:column; gap:.35rem; }
.cp-activity-row { display:flex; align-items:flex-start; gap:.75rem; padding:.4rem .5rem; border-radius:.5rem; }
@media (max-width:480px) {
  .cp-activity-row { flex-wrap:wrap; }
  .cp-time { width:100%; padding-left:3rem; }
}
.cp-activity-avatar { width:2.25rem; height:2.25rem; border-radius:999px; display:grid; place-items:center; font-size:.75rem; font-weight:800; flex-shrink:0; }
.cp-activity-copy { min-width:0; flex:1; }
.cp-activity-copy p { margin:0; font-size:.875rem; font-weight:600; color:#111827; }
.cp-time { font-size:.75rem; color:#6b7280; flex-shrink:0; }
.cp-updates { border-top:1px solid #e5e7eb; border-bottom:1px solid #e5e7eb; background:#ffffff; }
.cp-updates-inner { max-width:80rem; margin:0 auto; padding:2.5rem 1rem; }
@media (min-width:768px) { .cp-updates-inner { padding:4rem 1.25rem; } }
@media (min-width:1024px) { .cp-updates-inner { padding:5rem 2.5rem; } }
.cp-section-label { margin:0; font-size:.75rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#6366f1; }
.cp-updates h2 { margin:.75rem 0 0; font-size:clamp(1.7rem,3vw,2.25rem); letter-spacing:-.02em; color:#111827; }
.cp-cards { margin-top:2.5rem; display:grid; gap:1.25rem; }
@media (min-width:768px) { .cp-cards { grid-template-columns:repeat(3,1fr); } }
.cp-card { border-radius:.75rem; border:1px solid #e5e7eb; background:#ffffff; padding:1.5rem; transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease; }
.cp-card:hover { transform:translateY(-3px); border-color:#c7d2fe; box-shadow:0 10px 15px -3px rgb(0 0 0/.08); }
.cp-card-index { display:grid; width:2.25rem; height:2.25rem; place-items:center; border-radius:.5rem; background:#eef2ff; color:#6366f1; font-size:.875rem; font-weight:700; }
.cp-card h3 { margin:1.2rem 0 0; font-size:1.05rem; color:#111827; }
.cp-card p { margin:.5rem 0 0; font-size:.9rem; line-height:1.6; color:#6b7280; }
.cp-cta-wrap { max-width:80rem; margin:0 auto; padding:2.5rem 1rem; }
@media (min-width:768px) { .cp-cta-wrap { padding:4rem 1.25rem; } }
.cp-cta { border-radius:.75rem; background:#1e293b; padding:3rem 1.5rem; text-align:center; color:#fff; }
.cp-cta-label { margin:0; font-size:.75rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#818cf8; }
.cp-cta h2 { margin:.75rem auto 0; max-width:36rem; font-size:clamp(1.7rem,3vw,2.25rem); color:#f9fafb; }
.cp-cta p { margin:1rem auto 0; max-width:32rem; color:#94a3b8; line-height:1.7; }
.cp-btn-navy { margin-top:1.75rem; display:inline-flex; height:2.75rem; align-items:center; justify-content:center; border-radius:.5rem; background:#6366f1; color:#fff; padding:0 1.25rem; font-size:.875rem; font-weight:700; text-decoration:none; transition:background .15s; }
.cp-btn-navy:hover { background:#4f46e5; }
`;
