import { mapAdminUser } from '@comm-platform/api';
import { listAdminSubmissions } from '@comm-platform/coding/server';

import { MONTHS, matchesMonthYear, yearOptions } from '@/lib/date-filters';
import { createServiceSupabase } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ user?: string; month?: string; year?: string; score?: string }>;

async function loadUsers() {
  try {
    const service = createServiceSupabase();
    const { data } = await service.from('admin_user_overview').select('*');
    return (data ?? []).map(mapAdminUser);
  } catch {
    return [];
  }
}

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const user = params.user ?? '';
  const month = params.month ?? '';
  const year = params.year ?? '';
  const score = params.score ?? '';
  const [rows, users] = await Promise.all([listAdminSubmissions(), loadUsers()]);
  const names = new Map(users.map((u) => [u.id, u.displayName ?? u.username ?? u.id]));

  let items = rows;
  if (user) items = items.filter((s) => s.userId === user);
  if (month || year) items = items.filter((s) => matchesMonthYear(s.createdAt, month, year));
  if (score) {
    const min = Number(score);
    if (!Number.isNaN(min)) items = items.filter((s) => s.score >= min);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Submissions</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">{items.length} matching submissions</p>
      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <select name="user" defaultValue={user} className="rounded-xl border px-3 py-2">
          <option value="">All users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.displayName ?? u.username}
            </option>
          ))}
        </select>
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
        <select name="score" defaultValue={score} className="rounded-xl border px-3 py-2">
          <option value="">Any score</option>
          <option value="100">100% (accepted)</option>
          <option value="50">50% or higher</option>
          <option value="1">Scored at least 1%</option>
        </select>
        <button className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Filter
        </button>
      </form>
      <div className="mt-6 overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Problem</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">{new Date(row.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <a className="text-[var(--color-primary)]" href={`/admin/users/${row.userId}`}>
                    {names.get(row.userId) ?? row.userId.slice(0, 8)}
                  </a>
                </td>
                <td className="px-4 py-3">{row.questionTitle}</td>
                <td className="px-4 py-3">{row.status.replaceAll('_', ' ')}</td>
                <td className="px-4 py-3">
                  {row.passedTestCases}/{row.totalTestCases} ({row.score}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
