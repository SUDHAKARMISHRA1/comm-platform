'use client';

import { adminLogout } from '@/app/admin/login/actions';

type AdminNavKey = 'users' | 'practice';

type Props = {
  active: AdminNavKey;
};

function go(href: string) {
  window.location.assign(href);
}

export function AdminHeader({ active }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
      <div className="flex items-center gap-4">
        <p className="font-semibold">Comm Platform admin</p>
        <form
          action="/admin"
          method="get"
          onSubmitCapture={(event) => {
            event.preventDefault();
            event.stopPropagation();
            go('/admin');
          }}
        >
          <button
            type="submit"
            className={`text-sm ${active === 'users' ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-primary)]'}`}
          >
            Users
          </button>
        </form>
        <form
          action="/admin/practice"
          method="get"
          onSubmitCapture={(event) => {
            event.preventDefault();
            event.stopPropagation();
            go('/admin/practice');
          }}
        >
          <button
            type="submit"
            className={`text-sm ${active === 'practice' ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-primary)]'}`}
          >
            Practice
          </button>
        </form>
      </div>
      <form action={adminLogout}>
        <button className="text-sm text-[var(--color-primary)]" type="submit">
          Sign out
        </button>
      </form>
    </header>
  );
}
