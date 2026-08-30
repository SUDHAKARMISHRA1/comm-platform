import type { SubmissionSummary } from '@comm-platform/coding';

export type DayInsight = {
  dateKey: string;
  count: number;
  accepted: number;
  uniqueProblems: string[];
  languages: string[];
};

export function localDateKey(isoOrDate: string | Date) {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function groupSubmissionsByDay(submissions: SubmissionSummary[]) {
  const map = new Map<string, DayInsight>();
  for (const s of submissions) {
    const dateKey = localDateKey(s.createdAt);
    const current = map.get(dateKey) ?? {
      dateKey,
      count: 0,
      accepted: 0,
      uniqueProblems: [],
      languages: [],
    };
    current.count += 1;
    if (s.status === 'ACCEPTED') current.accepted += 1;
    if (!current.uniqueProblems.includes(s.questionTitle)) current.uniqueProblems.push(s.questionTitle);
    if (!current.languages.includes(s.language)) current.languages.push(s.language);
    map.set(dateKey, current);
  }
  return map;
}

export function periodStats(submissions: SubmissionSummary[], now = new Date()) {
  const todayKey = localDateKey(now);
  const month = now.getMonth();
  const year = now.getFullYear();
  let today = 0;
  let todayAccepted = 0;
  let monthCount = 0;
  let monthAccepted = 0;
  let yearCount = 0;
  let yearAccepted = 0;
  const yearDays = new Set<string>();

  for (const s of submissions) {
    const d = new Date(s.createdAt);
    const key = localDateKey(d);
    const ok = s.status === 'ACCEPTED';
    if (key === todayKey) {
      today += 1;
      if (ok) todayAccepted += 1;
    }
    if (d.getFullYear() === year && d.getMonth() === month) {
      monthCount += 1;
      if (ok) monthAccepted += 1;
    }
    if (d.getFullYear() === year) {
      yearCount += 1;
      if (ok) yearAccepted += 1;
      yearDays.add(key);
    }
  }

  return {
    today,
    todayAccepted,
    monthCount,
    monthAccepted,
    yearCount,
    yearAccepted,
    activeDaysThisYear: yearDays.size,
  };
}

export function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number | null; dateKey: string | null }> = [];
  for (let i = 0; i < startPad; i += 1) cells.push({ day: null, dateKey: null });
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, dateKey: localDateKey(new Date(year, month, day)) });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, dateKey: null });
  return cells;
}

export function intensity(count: number) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function inLastMonths(iso: string, months: number, now = new Date()) {
  const from = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  return new Date(iso) >= from;
}

export function formatDayLabel(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
