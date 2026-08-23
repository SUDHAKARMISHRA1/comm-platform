export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[var(--color-bg)] px-6 py-16 text-[var(--color-text)]">
      <main className="w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          Public website
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Comm Platform</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-text-muted)]">
          Accounts, profiles, and sessions live in the Expo product app. This Next.js app is the public
          site and the admin portal.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-[var(--color-primary-text)]"
            href="http://localhost:8081"
          >
            Open product app (dev)
          </a>
          <a
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--color-border)] px-5 text-sm font-semibold"
            href="/admin/login"
          >
            Admin sign in
          </a>
        </div>
      </main>
    </div>
  );
}
