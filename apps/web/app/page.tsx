import Link from 'next/link';

const productAppUrl = process.env.NEXT_PUBLIC_PRODUCT_APP_URL ?? 'http://localhost:8081';

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

const activity = [
  { initial: 'M', name: 'Maya Chen', detail: 'Shared an update in Product design', time: 'Just now', color: 'bg-violet-100 text-violet-700' },
  { initial: 'R', name: 'Rohan Patel', detail: 'Started a team discussion', time: '18 min ago', color: 'bg-sky-100 text-sky-700' },
  { initial: 'A', name: 'Amelia Ross', detail: 'Joined the Launch workspace', time: '1 hr ago', color: 'bg-amber-100 text-amber-700' },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-3" href="/" aria-label="Comm Platform home">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-950 shadow-sm">
              <span className="size-3 rounded-full bg-cyan-300 ring-4 ring-cyan-300/25" />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-950">Comm Platform</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex" aria-label="Main navigation">
            <Link className="transition hover:text-slate-950" href="/">Home</Link>
            <a className="transition hover:text-slate-950" href={`${productAppUrl}/home`}>App</a>
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 transition hover:text-slate-950 [&::-webkit-details-marker]:hidden">
                Account
                <svg aria-hidden="true" className="size-4 transition group-open:rotate-180" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/70">
                <a className="block rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-slate-950" href={`${productAppUrl}/login`}>Sign in</a>
                <a className="block rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-slate-950" href={`${productAppUrl}/signup`}>Sign up</a>
              </div>
            </details>
          </nav>

          <a className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950" href={`${productAppUrl}/signup`}>
            Get started
          </a>
        </div>
        <nav className="flex gap-5 overflow-x-auto border-t border-slate-100 px-5 py-3 text-sm font-medium text-slate-600 md:hidden" aria-label="Mobile navigation">
          <Link href="/">Home</Link><a href={`${productAppUrl}/home`}>App</a>
          <details className="group relative shrink-0">
            <summary className="flex cursor-pointer list-none items-center gap-1 [&::-webkit-details-marker]:hidden">Account <span aria-hidden="true" className="transition group-open:rotate-180">⌄</span></summary>
            <div className="absolute left-0 top-7 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/70">
              <a className="block rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-slate-950" href={`${productAppUrl}/login`}>Sign in</a>
              <a className="block rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-slate-950" href={`${productAppUrl}/signup`}>Sign up</a>
            </div>
          </details>
        </nav>
      </header>

      <main>
        <section className="relative isolate">
          <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_75%_0%,rgba(165,243,252,0.72),transparent_32%),radial-gradient(circle_at_15%_20%,rgba(224,231,255,0.8),transparent_31%)]" />
          <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:px-10 lg:pb-28">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1.5 text-xs font-semibold tracking-wide text-cyan-800 shadow-sm"><span className="size-1.5 rounded-full bg-cyan-500" />CONNECT WITH CLARITY</p>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">A better home for the conversations that move work forward.</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Comm Platform brings updates, people, and shared momentum into one simple, dependable place.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800" href={`${productAppUrl}/signup`}>Create your account <span aria-hidden className="ml-2">→</span></a>
                <a className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50" href="#updates">Explore updates</a>
              </div>
              <p className="mt-5 text-sm text-slate-500">A simple start today. More collaborative tools on the way.</p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white p-3 shadow-2xl shadow-slate-300/50 sm:p-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your workspace</p><h2 className="mt-1 text-lg font-semibold text-slate-950">Good morning, Alex</h2></div><span className="grid size-10 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">A</span></div>
                <div className="mt-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-slate-900">Launch workspace</p><p className="mt-1 text-xs text-slate-500">8 members · Active now</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Live</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-3/4 rounded-full bg-cyan-500" /></div></div>
                <div className="mt-4 space-y-3">
                  {activity.map((item) => <div className="flex items-center gap-3 rounded-lg px-2 py-2" key={item.name}><span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${item.color}`}>{item.initial}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{item.name}</p><p className="truncate text-xs text-slate-500">{item.detail}</p></div><span className="shrink-0 text-xs text-slate-400">{item.time}</span></div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white" id="updates">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20"><div className="max-w-2xl"><p className="text-sm font-semibold text-cyan-700">WHAT&apos;S HAPPENING</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">A place built around progress.</h2><p className="mt-4 leading-7 text-slate-600">These are placeholder updates for now. They can later come from your admin-managed content system.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{highlights.map((highlight, index) => <article className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60" key={highlight.title}><span className="grid size-9 place-items-center rounded-lg bg-slate-950 text-sm font-semibold text-cyan-300">0{index + 1}</span><h3 className="mt-5 text-lg font-semibold text-slate-950">{highlight.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{highlight.description}</p></article>)}</div></div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20"><div className="rounded-2xl bg-slate-950 px-6 py-12 text-center sm:px-12"><p className="text-sm font-semibold text-cyan-300">READY WHEN YOU ARE</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Start with one conversation. Build from there.</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">Create your account and see the product app in action.</p><a className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200" href={`${productAppUrl}/signup`}>Sign up for Comm Platform</a></div></section>
      </main>

      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-slate-950"><span className="size-2.5 rounded-full bg-cyan-300" /></span><div><p className="text-sm font-semibold text-slate-950">Comm Platform</p><p className="text-xs text-slate-500">Connection, made considered.</p></div></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><Link className="hover:text-slate-950" href="/">Home</Link><a className="hover:text-slate-950" href={`${productAppUrl}/login`}>Sign in</a><a className="hover:text-slate-950" href={`${productAppUrl}/signup`}>Sign up</a><span>© {new Date().getFullYear()} Comm Platform</span></div></div></footer>
    </div>
  );
}
