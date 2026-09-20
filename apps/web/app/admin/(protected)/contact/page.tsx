import { mapAdminUser, mapContactMessage } from '@comm-platform/api';
import type { ContactMessage } from '@comm-platform/types';

import { MONTHS, matchesMonthYear, yearOptions } from '@/lib/date-filters';
import { createServiceSupabase } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;
const MISSING_TABLE = /contact_messages|schema cache/i;

type SearchParams = Promise<{ q?: string; page?: string; month?: string; year?: string }>;

async function loadMessages() {
  try {
    const service = createServiceSupabase();
    const { data, error } = await service
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (error) {
      return { rows: [] as ContactMessage[], error: error.message, missing: MISSING_TABLE.test(error.message) };
    }
    return { rows: (data ?? []).map(mapContactMessage), error: null, missing: false };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not load contact messages';
    return { rows: [] as ContactMessage[], error: message, missing: MISSING_TABLE.test(message) };
  }
}

async function loadUsers() {
  try {
    const service = createServiceSupabase();
    const { data } = await service.from('admin_user_overview').select('*');
    return (data ?? []).map(mapAdminUser);
  } catch {
    return [];
  }
}

export default async function AdminContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = (params.q ?? '').trim();
  const month = params.month ?? '';
  const year = params.year ?? '';
  const page = Math.max(1, Number(params.page ?? '1') || 1);

  const [{ rows, error, missing }, users] = await Promise.all([loadMessages(), loadUsers()]);
  const names = new Map(users.map((u) => [u.id, u.displayName ?? u.username ?? u.email ?? u.id]));

  let items = rows;
  if (query) {
    const term = query.toLowerCase();
    items = items.filter(
      (row) =>
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.description.toLowerCase().includes(term),
    );
  }
  if (month || year) {
    items = items.filter((row) => matchesMonthYear(row.createdAt, month, year));
  }

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const slice = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function href(next: Record<string, string | number>) {
    const sp = new URLSearchParams();
    const merged = { q: query, month, year, page, ...next };
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== '' && !(k === 'page' && Number(v) === 1)) sp.set(k, String(v));
    });
    const qs = sp.toString();
    return qs ? `/admin/contact?${qs}` : '/admin/contact';
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Contact Us</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">{total} matching messages</p>
      {missing ? (
        <p className="mt-4 rounded-xl border border-[var(--color-warning)] bg-[var(--color-warning-soft)] px-4 py-3 text-sm text-[var(--color-warning-text)]">
          Run <code>supabase/migrations/0011_contact_messages.sql</code> in the Supabase SQL editor, then refresh.
        </p>
      ) : error ? (
        <p className="mt-4 text-[var(--color-danger)]">{error}</p>
      ) : null}
      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search name, email, or description"
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
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {slice.length ? (
              slice.map((row) => (
                <tr key={row.id} className="border-t border-[var(--color-border)] align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">
                    {row.userId ? (
                      <a className="text-[var(--color-primary)]" href={`/admin/users/${row.userId}`}>
                        {names.get(row.userId) ?? 'Account'}
                      </a>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">Guest</span>
                    )}
                  </td>
                  <td className="max-w-md whitespace-pre-wrap px-4 py-3">{row.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-[var(--color-text-muted)]" colSpan={5}>
                  No contact messages yet.
                </td>
              </tr>
            )}
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
