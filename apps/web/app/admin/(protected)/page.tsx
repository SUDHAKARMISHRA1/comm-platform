import { mapAdminUser } from '@comm-platform/api';

import { AdminHeader } from '@/components/admin-header';
import { createServiceSupabase } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function AdminDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = (params.q ?? '').trim();
  const page = Math.max(1, Number(params.page ?? '1') || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const service = createServiceSupabase();
  let request = service
    .from('admin_user_overview')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (query) {
    request = request.or(`username.ilike.%${query}%,display_name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data, count, error } = await request;
  const users = (data ?? []).map(mapAdminUser);
  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminHeader active="users" />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">{total} registered users</p>
        {error ? <p className="mt-4 text-[var(--color-danger)]">{error.message}</p> : null}
        <form className="mt-6">
          <label className="sr-only" htmlFor="q">
            Search users
          </label>
          <input
            id="q"
            name="q"
            defaultValue={query}
            placeholder="Search name, username, or email"
            className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3"
          />
        </form>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    <a className="text-[var(--color-primary)]" href={`/admin/users/${user.id}`}>
                      {user.displayName ?? user.username}
                    </a>
                    <div className="text-[var(--color-text-muted)]">@{user.username}</div>
                  </td>
                  <td className="px-4 py-3">{user.email ?? '—'}</td>
                  <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 capitalize">{user.accountStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-3 text-sm">
          {page > 1 ? (
            <a href={`/admin?q=${encodeURIComponent(query)}&page=${page - 1}`}>Previous</a>
          ) : null}
          {page < pageCount ? (
            <a href={`/admin?q=${encodeURIComponent(query)}&page=${page + 1}`}>Next</a>
          ) : null}
        </div>
      </main>
    </div>
  );
}
