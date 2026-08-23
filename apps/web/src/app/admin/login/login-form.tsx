'use client';

import { useActionState } from 'react';

import { adminLogin } from './actions';

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLogin, undefined);

  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-3 text-[var(--color-text)]"
        />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-3 text-[var(--color-text)]"
        />
      </label>
      {state?.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-[var(--color-primary-text)] disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in to admin'}
      </button>
    </form>
  );
}
