/**
 * Datums-Hilfsfunktionen für den Belegungskalender.
 *
 * Alle Funktionen arbeiten mit ISO-Tagen (`YYYY-MM-DD`) und rechnen intern in
 * UTC. Das ist Absicht: sobald man lokale Zeitzonen mischt, landet man bei
 * Sommerzeit-Umstellungen auf dem falschen Tag. Hier gibt es keine Uhrzeit,
 * also auch kein Zeitzonen-Problem.
 *
 * Bewusst framework-frei – dadurch ohne Angular testbar.
 */

const MS_PER_DAY = 86_400_000;

/** Prüft das Format, bevor mit einem Wert aus der JSON-Datei gerechnet wird. */
export function isIsoDay(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
  );
}

/** UTC-`Date` -> `YYYY-MM-DD`. */
export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Heute, aus Sicht des Besuchers (lokaler Kalendertag). */
export function todayIso(): string {
  const now = new Date();
  return toIso(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

/** Verschiebt einen ISO-Tag um `days` Tage. */
export function addDays(iso: string, days: number): string {
  return toIso(new Date(Date.parse(`${iso}T00:00:00Z`) + days * MS_PER_DAY));
}

/** Anzahl Nächte zwischen Anreise- und Abreisetag. */
export function nightsBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / MS_PER_DAY);
}

/** `2026-07-10` -> `10.07.2026`, ohne Umweg über `Date` und damit ohne Zeitzone. */
export function formatDe(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}.${month}.${year}`;
}

/** Monat eines ISO-Tags als `{ year, month }`, `month` ist 0-basiert wie bei `Date`. */
export function monthOf(iso: string): { year: number; month: number } {
  return { year: Number(iso.slice(0, 4)), month: Number(iso.slice(5, 7)) - 1 };
}

/** Verschiebt einen Monat um `offset` Monate; der Jahreswechsel fällt dabei an. */
export function addMonths(
  month: { year: number; month: number },
  offset: number,
): { year: number; month: number } {
  const shifted = new Date(Date.UTC(month.year, month.month + offset, 1));
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() };
}

/**
 * Die Wochen eines Monats als Raster, Montag zuerst.
 * Felder vor dem 1. und nach dem letzten Tag sind `null` – die Zelle bleibt leer.
 */
export function monthWeeks(year: number, month: number): (string | null)[][] {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  // getUTCDay() liefert 0 für Sonntag; +6 % 7 dreht das auf Montag = 0.
  const lead = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;

  const cells: (string | null)[] = Array<string | null>(lead).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(toIso(new Date(Date.UTC(year, month, day))));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const MONTH_NAMES_DE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const;

export const WEEKDAYS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;
