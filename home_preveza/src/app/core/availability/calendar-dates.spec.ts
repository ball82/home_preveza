import {
  addDays,
  addMonths,
  formatDe,
  isIsoDay,
  monthWeeks,
  nightsBetween,
} from './calendar-dates';

describe('calendar-dates', () => {
  it('rechnet über Monats- und Jahresgrenzen', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('rechnet über die Sommerzeit-Umstellung hinweg', () => {
    // In der Nacht auf den 29.03.2026 wird die Uhr umgestellt. Mit lokalen
    // Zeitzonen landet man hier auf dem 28., mit UTC nicht.
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29');
    expect(nightsBetween('2026-03-27', '2026-03-31')).toBe(4);
  });

  it('kennt Schaltjahre', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(monthWeeks(2028, 1).flat().filter(Boolean).length).toBe(29);
  });

  it('zählt Nächte, nicht Tage', () => {
    expect(nightsBetween('2026-07-10', '2026-07-13')).toBe(3);
    expect(nightsBetween('2026-07-10', '2026-07-10')).toBe(0);
  });

  it('legt das Monatsraster auf Montag als ersten Tag', () => {
    // Der 01.09.2026 ist ein Dienstag -> genau ein leeres Feld davor.
    const weeks = monthWeeks(2026, 8);
    expect(weeks[0][0]).toBeNull();
    expect(weeks[0][1]).toBe('2026-09-01');
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks.flat().filter(Boolean).length).toBe(30);
  });

  it('erkennt ungültige Datumsangaben aus der JSON-Datei', () => {
    expect(isIsoDay('2026-07-10')).toBe(true);
    expect(isIsoDay('10.07.2026')).toBe(false);
    expect(isIsoDay('2026-13-01')).toBe(false);
    expect(isIsoDay(undefined)).toBe(false);
  });

  it('verschiebt Monate über den Jahreswechsel', () => {
    expect(addMonths({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 });
    expect(addMonths({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 });
  });

  it('formatiert deutsch', () => {
    expect(formatDe('2026-07-01')).toBe('01.07.2026');
  });
});
