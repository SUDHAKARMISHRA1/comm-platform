export function matchesMonthYear(iso: string | null | undefined, month?: string, year?: string) {
  if (!iso) return !month && !year;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  if (year && String(date.getFullYear()) !== year) return false;
  if (month && String(date.getMonth() + 1) !== String(Number(month))) return false;
  return true;
}

export function yearOptions(span = 6) {
  const current = new Date().getFullYear();
  return Array.from({ length: span }, (_, i) => String(current - i));
}

export const MONTHS = [
  { value: '1', label: 'Jan' },
  { value: '2', label: 'Feb' },
  { value: '3', label: 'Mar' },
  { value: '4', label: 'Apr' },
  { value: '5', label: 'May' },
  { value: '6', label: 'Jun' },
  { value: '7', label: 'Jul' },
  { value: '8', label: 'Aug' },
  { value: '9', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];
