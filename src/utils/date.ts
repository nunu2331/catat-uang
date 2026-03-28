const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Today's date in YYYY-MM-DD
 */
export function today(): string {
  return toDateString(new Date());
}

/**
 * Convert Date to YYYY-MM-DD
 */
export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * First and last date of the given month (YYYY-MM-DD)
 */
export function monthRange(year: number, month: number): {
  startDate: string;
  endDate: string;
} {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
}

/**
 * Format YYYY-MM-DD for display (e.g. "14 Feb 2026")
 */
export function formatDisplayDate(iso: string): string {
  if (!ISO_DATE.test(iso)) return iso;
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * Current year and month (1–12)
 */
export function currentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/**
 * Month name in Indonesian
 */
export function monthName(month: number): string {
  const names = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return names[month - 1] ?? '';
}
