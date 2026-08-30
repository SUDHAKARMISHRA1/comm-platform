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
    <header className="flex items-center justify-between bg-[var(--color-navy)] px-6 py-4">
      <div className="flex items-center gap-4">
        <p className="font-semibold text-white">Comm Platform admin</p>
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
            className={`text-sm ${active === 'users' ? 'font-semibold text-white' : 'text-white/80'}`}
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
            className={`text-sm ${active === 'practice' ? 'font-semibold text-white' : 'text-white/80'}`}
          >
            Practice
          </button>
        </form>
      </div>
      <form action={adminLogout}>
        <button className="rounded-lg bg-[var(--color-navy-muted)] px-3 py-1.5 text-sm font-semibold text-white" type="submit">
          Sign out
        </button>
      </form>
    </header>
  );
}
