import { AdminLoginForm } from './login-form';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <main className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">Admin portal</p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Access is granted only after the server checks <code>user_roles</code>. Non-admins are blocked.
        </p>
        <AdminLoginForm />
      </main>
    </div>
  );
}
