import { mapAdminUser } from '@comm-platform/api';

import { MONTHS, matchesMonthYear, yearOptions } from '@/lib/date-filters';
import { createServiceSupabase } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; page?: string; status?: string; month?: string; year?: string }>;

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = (params.q ?? '').trim();
  const status = params.status === 'active' || params.status === 'inactive' ? params.status : 'all';
  const month = params.month ?? '';
  const year = params.year ?? '';
  const page = Math.max(1, Number(params.page ?? '1') || 1);

  const service = createServiceSupabase();
  const { data, error } = await service.from('admin_user_overview').select('*').order('created_at', { ascending: false });
  let users = (data ?? []).map(mapAdminUser);

  if (query) {
    const term = query.toLowerCase();
    users = users.filter(
      (u) =>
        (u.username ?? '').toLowerCase().includes(term) ||
        (u.displayName ?? '').toLowerCase().includes(term) ||
        (u.email ?? '').toLowerCase().includes(term),
    );
  }
  if (status === 'active') users = users.filter((u) => u.accountStatus === 'active');
  if (status === 'inactive') users = users.filter((u) => u.accountStatus !== 'active');
  if (month || year) {
    users = users.filter((u) =>
      status === 'inactive'
        ? matchesMonthYear(u.lastSignInAt ?? u.createdAt, month, year)
        : matchesMonthYear(u.createdAt, month, year),
    );
  }

  const total = users.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const slice = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const title = status === 'active' ? 'Active users' : status === 'inactive' ? 'Inactive users' : 'All users';

  function href(next: Record<string, string | number>) {
    const sp = new URLSearchParams();
    const merged = { q: query, status, month, year, page, ...next };
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== '' && v !== 'all' && !(k === 'page' && Number(v) === 1)) sp.set(k, String(v));
    });
    const qs = sp.toString();
    return qs ? `/admin/users?${qs}` : '/admin/users';
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">{total} matching users</p>
      {error ? <p className="mt-4 text-[var(--color-danger)]">{error.message}</p> : null}
      <form className="mt-6 flex flex-wrap gap-3" method="get">
        {status !== 'all' ? <input type="hidden" name="status" value={status} /> : null}
        <input
          name="q"
          defaultValue={query}
          placeholder="Search name, username, or email"
          className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3"
        />
        <select name="month" defaultValue={month} className="rounded-xl border px-3 py-2">
          <option value="">All months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select name="year" defaultValue={year} className="rounded-xl border px-3 py-2">
          <option value="">All years</option>
          {yearOptions().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Filter
        </button>
      </form>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--color-border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Last sign-in</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((user) => (
              <tr key={user.id} className="border-t border-[var(--color-border)]">
                <td className="px-4 py-3">
                  <a className="text-[var(--color-primary)]" href={`/admin/users/${user.id}`}>
                    {user.displayName ?? user.username}
                  </a>
                  <div className="text-[var(--color-text-muted)]">@{user.username}</div>
                </td>
                <td className="px-4 py-3">{user.email ?? '—'}</td>
                <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}</td>
                <td className="px-4 py-3 capitalize">{user.accountStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-3 text-sm">
        {page > 1 ? <a href={href({ page: page - 1 })}>Previous</a> : null}
        {page < pageCount ? <a href={href({ page: page + 1 })}>Next</a> : null}
      </div>
    </main>
  );
}
