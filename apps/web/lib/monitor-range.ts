import type { FrontendApiFailure } from '@comm-platform/types';

export function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function resolveMonitorRange(params: { day?: string; month?: string; year?: string; range?: string }) {
  const now = new Date();
  const day = params.day?.trim() ?? '';
  const month = params.month?.trim() ?? '';
  const year = params.year?.trim() ?? '';
  const range = params.range?.trim() ?? '';

  if (day) {
    const start = new Date(`${day}T00:00:00`);
    const end = new Date(`${day}T23:59:59.999`);
    if (!Number.isNaN(start.getTime())) {
      return { start, end, grain: 'hour' as const, label: day };
    }
  }

  if (range === '1' || range === '7' || range === '30' || range === '365') {
    const days = range === '1' ? 1 : range === '30' ? 30 : range === '365' ? 365 : 7;
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const grain = days <= 2 ? ('hour' as const) : days <= 90 ? ('day' as const) : ('month' as const);
    return { start, end: now, grain, label: `Last ${days} day${days === 1 ? '' : 's'}` };
  }

  if (month || year) {
    const y = Number(year) || now.getFullYear();
    if (month) {
      const m = Number(month) - 1;
      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
      return { start, end, grain: 'day' as const, label: `${y}-${pad2(m + 1)}` };
    }
    return {
      start: new Date(y, 0, 1),
      end: new Date(y, 11, 31, 23, 59, 59, 999),
      grain: 'month' as const,
      label: String(y),
    };
  }

  const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return { start, end: now, grain: 'day' as const, label: 'Last 7 days' };
}

export function bucketKey(date: Date, grain: 'hour' | 'day' | 'month') {
  if (Number.isNaN(date.getTime())) return 'unknown';
  if (grain === 'hour') {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:00`;
  }
  if (grain === 'month') {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
  }
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function fillBuckets(
  rows: FrontendApiFailure[],
  start: Date,
  end: Date,
  grain: 'hour' | 'day' | 'month',
) {
  const counts = new Map<string, number>();
  const cursor = new Date(start.getTime());
  if (grain === 'hour') cursor.setMinutes(0, 0, 0);
  if (grain === 'day') cursor.setHours(0, 0, 0, 0);
  if (grain === 'month') {
    cursor.setDate(1);
    cursor.setHours(0, 0, 0, 0);
  }

  let steps = 0;
  while (cursor <= end && steps < 400) {
    counts.set(bucketKey(cursor, grain), 0);
    if (grain === 'hour') cursor.setHours(cursor.getHours() + 1);
    else if (grain === 'day') cursor.setDate(cursor.getDate() + 1);
    else cursor.setMonth(cursor.getMonth() + 1);
    steps += 1;
  }

  for (const row of rows) {
    const key = bucketKey(new Date(row.createdAt), grain);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()].map(([label, count]) => ({ label, count }));
}

export function healthFromFailures(rows: FrontendApiFailure[], now = Date.now()) {
  const hour = rows.filter((row) => now - new Date(row.createdAt).getTime() <= 60 * 60 * 1000).length;
  const day = rows.filter((row) => now - new Date(row.createdAt).getTime() <= 24 * 60 * 60 * 1000).length;
  if (hour >= 10 || day >= 50) return { label: 'Unhealthy', tone: 'danger' as const, hour, day };
  if (hour >= 3 || day >= 10) return { label: 'Degraded', tone: 'warning' as const, hour, day };
  if (day > 0) return { label: 'Watch', tone: 'warning' as const, hour, day };
  return { label: 'Healthy', tone: 'success' as const, hour, day };
}
