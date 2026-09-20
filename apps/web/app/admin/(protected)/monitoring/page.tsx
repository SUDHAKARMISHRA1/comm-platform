import { mapAdminUser, mapFrontendApiFailure } from '@comm-platform/api';
import type { FrontendApiFailure } from '@comm-platform/types';

import { MONTHS, yearOptions } from '@/lib/date-filters';
import { fillBuckets, healthFromFailures, resolveMonitorRange } from '@/lib/monitor-range';
import { createServiceSupabase } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{
  range?: string;
  day?: string;
  month?: string;
  year?: string;
  path?: string;
  status?: string;
}>;

const MISSING_TABLE = /frontend_api_failures|schema cache/i;

function toneClass(tone: 'success' | 'warning' | 'danger') {
  if (tone === 'success') return 'bg-[var(--color-success-soft)] text-[var(--color-success-text)]';
  if (tone === 'danger') return 'bg-[var(--color-danger-soft)] text-[var(--color-danger-text)]';
  return 'bg-[var(--color-warning-soft)] text-[var(--color-warning-text)]';
}

function BarChart({ items, empty }: { items: { label: string; count: number }[]; empty: string }) {
  if (!items.length) {
    return <p className="mt-6 text-sm text-[var(--color-text-muted)]">{empty}</p>;
  }
  const max = Math.max(1, ...items.map((item) => item.count));
  const shown = items.length > 24 ? items.filter((_, i) => i % Math.ceil(items.length / 24) === 0) : items;
  return (
    <div className="mt-4 flex h-44 items-end gap-1">
      {shown.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[10px] text-[var(--color-text-muted)]">{item.count || ''}</span>
          <div
            className="w-full rounded-t bg-[var(--color-danger)]"
            style={{ height: `${Math.max(item.count ? 8 : 2, (item.count / max) * 100)}%` }}
            title={`${item.label}: ${item.count}`}
          />
          <span className="w-full truncate text-center text-[10px] text-[var(--color-text-muted)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function HorizontalBars({ items }: { items: { label: string; count: number }[] }) {
  if (!items.length) {
    return <p className="mt-6 text-sm text-[var(--color-text-muted)]">No API failures in this range.</p>;
  }
  const max = Math.max(1, ...items.map((item) => item.count));
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="truncate font-mono">{item.label}</span>
            <span className="shrink-0 font-semibold">{item.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
            <div
              className="h-full rounded-full bg-[var(--color-danger)]"
              style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

async function loadFailures(start: Date, end: Date) {
  try {
    const service = createServiceSupabase();
    const { data, error } = await service
      .from('frontend_api_failures')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false })
      .limit(2000);
    if (error) {
      return { rows: [] as FrontendApiFailure[], error: error.message, missing: MISSING_TABLE.test(error.message) };
    }
    return { rows: (data ?? []).map(mapFrontendApiFailure), error: null, missing: false };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not load failures';
    return { rows: [] as FrontendApiFailure[], error: message, missing: MISSING_TABLE.test(message) };
  }
}

async function loadHealthRows() {
  const start = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const { rows } = await loadFailures(start, new Date());
  return rows;
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

export default async function FrontendMonitorPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const range = params.range ?? '7';
  const day = params.day ?? '';
  const month = params.month ?? '';
  const year = params.year ?? '';
  const path = params.path ?? '';
  const status = params.status ?? '';
  const period = resolveMonitorRange({ range, day, month, year });

  const [{ rows, error, missing }, users, healthRows] = await Promise.all([
    loadFailures(period.start, period.end),
    loadUsers(),
    loadHealthRows(),
  ]);
  const names = new Map(users.map((u) => [u.id, u.displayName ?? u.username ?? u.email ?? u.id]));

  const paths = [...new Set(rows.map((row) => row.path))].sort();
  let items = rows;
  if (path) items = items.filter((row) => row.path === path);
  if (status) {
    const code = Number(status);
    if (!Number.isNaN(code)) items = items.filter((row) => row.statusCode === code);
  }

  const health = healthFromFailures(healthRows);
  const trend = fillBuckets(items, period.start, period.end, period.grain);
  const byPath = [...items.reduce((map, row) => map.set(row.path, (map.get(row.path) ?? 0) + 1), new Map<string, number>())]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const byStatus = [...items.reduce((map, row) => {
    const label = row.statusCode === 0 ? 'Network (0)' : String(row.statusCode);
    return map.set(label, (map.get(label) ?? 0) + 1);
  }, new Map<string, number>())]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
  const affectedUsers = new Set(items.map((row) => row.userId).filter(Boolean)).size;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Frontend monitor</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Product-app API failures only. Successful calls are not stored, so volume stays small. Extra context can be added
        later in <code>metadata</code>.
      </p>

      {missing ? (
        <div className="mt-6 rounded-2xl border border-[var(--color-warning)] bg-[var(--color-warning-soft)] p-4 text-sm">
          The <code>frontend_api_failures</code> table is missing. Run{' '}
          <code>supabase/migrations/0010_frontend_api_failures.sql</code> in the Supabase SQL editor, then refresh.
        </div>
      ) : null}
      {error && !missing ? <p className="mt-4 text-[var(--color-danger)]">{error}</p> : null}

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <select name="range" defaultValue={day || month || year ? '' : range} className="rounded-xl border px-3 py-2">
          <option value="">Custom / all dates below</option>
          <option value="1">Last 24 hours</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="365">Last 12 months</option>
        </select>
        <input type="date" name="day" defaultValue={day} className="rounded-xl border px-3 py-2" />
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
        <select name="path" defaultValue={path} className="rounded-xl border px-3 py-2">
          <option value="">All APIs</option>
          {paths.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="rounded-xl border px-3 py-2">
          <option value="">All statuses</option>
          <option value="0">Network (0)</option>
          <option value="400">400</option>
          <option value="401">401</option>
          <option value="403">403</option>
          <option value="404">404</option>
          <option value="429">429</option>
          <option value="500">500</option>
          <option value="503">503</option>
        </select>
        <button className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Filter
        </button>
      </form>
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">
        Showing {items.length} failure{items.length === 1 ? '' : 's'} · {period.label}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">API health</p>
          <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${toneClass(health.tone)}`}>
            {health.label}
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Live last 24 hours, independent of the date filter. {health.hour} in the last hour · {health.day} in 24h
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Failures in range</p>
          <p className="mt-2 text-3xl font-semibold">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">APIs with failures</p>
          <p className="mt-2 text-3xl font-semibold">{byPath.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Users affected</p>
          <p className="mt-2 text-3xl font-semibold">{affectedUsers}</p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">{health.hour} failures in the last hour</p>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-semibold">Failure trend</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Volume of stored failures over time.</p>
          <BarChart items={trend} empty="No failures in this range." />
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-semibold">Failures by API</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Highest-volume failing endpoints.</p>
          <HorizontalBars items={byPath} />
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-semibold">Success vs failure</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Success hits are not saved. This chart is failure-only so we can add success counters later without changing
            the failure log.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Failures (stored)</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                <div className="h-full w-full rounded-full bg-[var(--color-danger)]" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Successes</span>
                <span className="font-semibold text-[var(--color-text-muted)]">Not stored</span>
              </div>
              <div className="h-3 rounded-full border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)]" />
            </div>
          </div>
          <ul className="mt-6 space-y-1 text-sm text-[var(--color-text-muted)]">
            {byStatus.map((item) => (
              <li key={item.label} className="flex justify-between">
                <span>HTTP {item.label}</span>
                <span className="font-semibold text-[var(--color-text)]">{item.count}</span>
              </li>
            ))}
            {byStatus.length === 0 ? <li>No status breakdown yet.</li> : null}
          </ul>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-semibold">What we store</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Each row is one failed product API call from the Expo app. Columns like <code>error_code</code>,{' '}
            <code>page_path</code>, and <code>metadata</code> are ready for later fields.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-muted)]">
            <li>Path, method, status (0 = network)</li>
            <li>Error message returned to the user</li>
            <li>User, platform, app version</li>
            <li>JSON metadata for extra context later</li>
          </ul>
        </div>
      </section>

      <div className="mt-8 overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">API</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Error</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-[var(--color-text-muted)]" colSpan={6}>
                  No failures in this range.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id} className="border-t align-top">
                  <td className="whitespace-nowrap px-4 py-3">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">{row.method}</span>{' '}
                    <span className="font-mono">{row.path}</span>
                  </td>
                  <td className="px-4 py-3">{row.statusCode}</td>
                  <td className="px-4 py-3">
                    {row.userId ? (
                      <a className="text-[var(--color-primary)]" href={`/admin/users/${row.userId}`}>
                        {names.get(row.userId) ?? row.userId.slice(0, 8)}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3">{row.clientPlatform ?? '—'}</td>
                  <td className="max-w-sm px-4 py-3">
                    <p>{row.errorMessage ?? '—'}</p>
                    {row.pagePath || Object.keys(row.metadata).length ? (
                      <details className="mt-1 text-xs text-[var(--color-text-muted)]">
                        <summary>More</summary>
                        {row.pagePath ? <p>Page: {row.pagePath}</p> : null}
                        {row.appVersion ? <p>App: {row.appVersion}</p> : null}
                        {row.errorCode ? <p>Code: {row.errorCode}</p> : null}
                        {Object.keys(row.metadata).length ? (
                          <pre className="mt-1 overflow-x-auto">{JSON.stringify(row.metadata, null, 2)}</pre>
                        ) : null}
                      </details>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
