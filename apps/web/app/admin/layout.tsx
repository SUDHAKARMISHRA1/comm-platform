import { adminLogout } from './login/actions';
import { requireAdmin } from '@/lib/require-admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
      {children}
    </div>
  );
}

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div>
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <p className="font-semibold">Comm Platform admin</p>
        <form action={adminLogout}>
          <button className="text-sm text-[var(--color-primary)]" type="submit">
            Sign out
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}
