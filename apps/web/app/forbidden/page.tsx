export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-6 py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-danger)]">403</p>
      <h1 className="mt-3 text-3xl font-semibold">Admin access required</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        You are signed in, but this account is not in <code>user_roles</code> as an admin. User data was
        not loaded.
      </p>
      <a className="mt-8 text-[var(--color-primary)]" href={process.env.NEXT_PUBLIC_PRODUCT_APP_URL ?? 'http://localhost:8081'}>
        Back to Comm Platform
      </a>
    </main>
  );
}
