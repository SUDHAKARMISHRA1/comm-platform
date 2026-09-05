/** Last-7-days activity buckets for the student dashboard calendar. */
import type { WeeklyActivityDay } from './types';

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function localDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildWeeklyActivity(
  submissions: { createdAt: string }[],
  now = new Date(),
): WeeklyActivityDay[] {
  const counts = new Map<string, number>();
  for (const row of submissions) {
    const date = new Date(row.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = localDateKey(date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const days: WeeklyActivityDay[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    const dateKey = localDateKey(date);
    days.push({
      day: WEEKDAY[date.getDay()] ?? 'Sun',
      dateKey,
      count: counts.get(dateKey) ?? 0,
    });
  }
  return days;
}
