import { DAYS } from './grid';

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** Local-time date from an ISO string (avoids the UTC shift of `new Date('YYYY-MM-DD')`). */
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** ISO date of the Monday on or before `date`. */
export function mondayOf(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return iso(d);
}

export function addWeeks(week: string, n: number): string {
  const d = parse(week);
  d.setDate(d.getDate() + n * 7);
  return iso(d);
}

/** The Mon–Fri dates of a week. */
export function weekDays(week: string): Date[] {
  const start = parse(week);
  return Array.from({ length: DAYS }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
export const formatDayMonth = (d: Date) => dayMonth.format(d);

export function formatRange(week: string): string {
  const days = weekDays(week);
  return `${formatDayMonth(days[0])} – ${formatDayMonth(days[DAYS - 1])}`;
}

export const isSameDay = (a: Date, b: Date) => iso(a) === iso(b);
