import { AppShell } from '@/components/app-shell';

const activity = [
  { initial: 'M', name: 'Maya Chen', detail: 'Shared an update in Product design', time: 'Just now', color: '#ede9fe', text: '#6d28d9' },
  { initial: 'R', name: 'Rohan Patel', detail: 'Started a team discussion', time: '18 min ago', color: '#e0f2fe', text: '#0369a1' },
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
            <a href="/signup" className="cp-btn-cyan">
              Sign up for Comm Platform
            </a>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

const homeCss = `
.cp-home { background:#f8fafc; color:#0f172a; min-height:100%; }
.cp-hero { position:relative; isolation:isolate; overflow:hidden; }
.cp-hero-glow { position:absolute; inset:0 0 auto; height:34rem; z-index:-1; pointer-events:none;
  background: radial-gradient(circle at 75% 0%, rgba(165,243,252,.72), transparent 32%),
              radial-gradient(circle at 15% 20%, rgba(224,231,255,.8), transparent 31%); }
.cp-hero-grid { max-width:80rem; margin:0 auto; padding:4rem 1.25rem 5rem; display:grid; gap:3.5rem; align-items:center; }
@media (min-width:1024px) { .cp-hero-grid { grid-template-columns:1.05fr .95fr; gap:5rem; padding:6rem 2.5rem 7rem; } }
.cp-copy { max-width:40rem; }
.cp-pill { display:inline-flex; align-items:center; gap:.5rem; border:1px solid #a5f3fc; background:rgba(255,255,255,.8);
  padding:.35rem .75rem; border-radius:999px; font-size:11px; font-weight:700; letter-spacing:.08em; color:#155e75; box-shadow:0 1px 2px rgba(15,23,42,.06); }
.cp-pill-dot { width:6px; height:6px; border-radius:99px; background:#06b6d4; }
.cp-copy h1 { margin:1.25rem 0 0; font-size:clamp(2rem,4vw,3.6rem); line-height:1.08; letter-spacing:-.045em; font-weight:650; color:#020617; }
.cp-lead { margin:1.25rem 0 0; max-width:36rem; font-size:1.125rem; line-height:1.8; color:#475569; }
.cp-actions { margin-top:2rem; display:flex; flex-wrap:wrap; gap:.75rem; }
.cp-btn-dark { display:inline-flex; height:3rem; align-items:center; justify-content:center; border-radius:.6rem; background:#020617; color:#fff; padding:0 1.25rem; font-size:.875rem; font-weight:700; text-decoration:none; box-shadow:0 10px 24px rgba(2,6,23,.12); }
.cp-btn-dark:hover { background:#1e293b; transform:translateY(-1px); }
.cp-btn-light { display:inline-flex; height:3rem; align-items:center; justify-content:center; border-radius:.6rem; border:1px solid #cbd5e1; background:#fff; color:#1e293b; padding:0 1.25rem; font-size:.875rem; font-weight:700; text-decoration:none; }
.cp-btn-light:hover { border-color:#94a3b8; background:#f8fafc; }
.cp-fine { margin-top:1.1rem; font-size:.875rem; color:#64748b; }
.cp-preview-wrap { border-radius:1.1rem; border:1px solid rgba(255,255,255,.8); background:#fff; padding:.75rem; box-shadow:0 30px 60px rgba(148,163,184,.35); }
.cp-preview { border-radius:.9rem; border:1px solid #e2e8f0; background:#f8fafc; padding:1.15rem; }
.cp-preview-head { display:flex; align-items:center; justify-content:space-between; }
.cp-kicker { margin:0; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#94a3b8; }
.cp-preview h2 { margin:.2rem 0 0; font-size:1.15rem; font-weight:700; }
.cp-avatar { width:2.5rem; height:2.5rem; border-radius:999px; background:#020617; color:#fff; display:grid; place-items:center; font-weight:700; font-size:.875rem; }
.cp-workspace { margin-top:1.4rem; border-radius:.9rem; background:#fff; padding:1rem; box-shadow:0 1px 2px rgba(15,23,42,.05); border:1px solid #e2e8f0; }
.cp-workspace-row { display:flex; justify-content:space-between; gap:1rem; align-items:center; }
.cp-workspace-name { margin:0; font-weight:700; }
.cp-subtle { margin:.25rem 0 0; font-size:.75rem; color:#64748b; }
.cp-live { border-radius:999px; background:#ecfdf5; color:#047857; padding:.2rem .65rem; font-size:.75rem; font-weight:700; }
.cp-progress { margin-top:1rem; height:8px; overflow:hidden; border-radius:999px; background:#e2e8f0; }
.cp-progress-fill { height:100%; width:75%; border-radius:999px; background:#06b6d4; }
.cp-activity { margin-top:1rem; display:flex; flex-direction:column; gap:.35rem; }
.cp-activity-row { display:flex; align-items:center; gap:.75rem; padding:.4rem .5rem; border-radius:.6rem; }
.cp-activity-avatar { width:2.25rem; height:2.25rem; border-radius:999px; display:grid; place-items:center; font-size:.75rem; font-weight:800; flex-shrink:0; }
.cp-activity-copy { min-width:0; flex:1; }
.cp-activity-copy p { margin:0; font-size:.875rem; font-weight:600; }
.cp-time { font-size:.75rem; color:#94a3b8; flex-shrink:0; }
.cp-updates { border-top:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; background:#fff; }
.cp-updates-inner { max-width:80rem; margin:0 auto; padding:4rem 1.25rem; }
@media (min-width:1024px) { .cp-updates-inner { padding:5rem 2.5rem; } }
.cp-section-label { margin:0; font-size:.875rem; font-weight:700; color:#0e7490; }
.cp-updates h2 { margin:.75rem 0 0; font-size:clamp(1.7rem,3vw,2.25rem); letter-spacing:-.02em; }
.cp-cards { margin-top:2.5rem; display:grid; gap:1.25rem; }
@media (min-width:768px) { .cp-cards { grid-template-columns:repeat(3,1fr); } }
.cp-card { border-radius:.9rem; border:1px solid #e2e8f0; background:#f8fafc; padding:1.5rem; transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease, background .15s ease; }
.cp-card:hover { transform:translateY(-4px); border-color:#a5f3fc; background:#fff; box-shadow:0 16px 32px rgba(148,163,184,.25); }
.cp-card-index { display:grid; width:2.25rem; height:2.25rem; place-items:center; border-radius:.6rem; background:#020617; color:#67e8f9; font-size:.875rem; font-weight:700; }
.cp-card h3 { margin:1.2rem 0 0; font-size:1.1rem; }
.cp-card p { margin:.5rem 0 0; font-size:.9rem; line-height:1.6; color:#475569; }
.cp-cta-wrap { max-width:80rem; margin:0 auto; padding:4rem 1.25rem; }
.cp-cta { border-radius:1.1rem; background:#020617; padding:3rem 1.5rem; text-align:center; color:#fff; }
.cp-cta-label { margin:0; font-size:.875rem; font-weight:700; color:#67e8f9; }
.cp-cta h2 { margin:.75rem auto 0; max-width:36rem; font-size:clamp(1.7rem,3vw,2.25rem); }
.cp-cta p { margin:1rem auto 0; max-width:32rem; color:#cbd5e1; line-height:1.7; }
.cp-btn-cyan { margin-top:1.75rem; display:inline-flex; height:2.75rem; align-items:center; justify-content:center; border-radius:.6rem; background:#67e8f9; color:#020617; padding:0 1.25rem; font-size:.875rem; font-weight:700; text-decoration:none; }
.cp-btn-cyan:hover { background:#a5f3fc; }
`;
