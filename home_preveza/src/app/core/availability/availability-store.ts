import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Booking } from '../models';
import { addDays, isIsoDay } from './calendar-dates';

/** Ladezustand der Belegungsdaten – die Oberfläche zeigt für jeden Fall etwas an. */
export type AvailabilityStatus = 'loading' | 'ready' | 'error';

/** Aufbau von `public/belegung.json`. */
interface AvailabilityFile {
  belegungen?: unknown;
}

/** Ein Zeitraum darf nicht länger als ein Jahr sein – fängt Tippfehler im Jahr ab. */
const MAX_NIGHTS = 366;

/** Pfad ab Domain-Wurzel, damit die Datei auch auf Unterseiten wie /room-1 gefunden wird. */
const SOURCE = '/belegung.json';

/**
 * Lädt die belegten Zeiträume und stellt sie pro Wohnung bereit.
 *
 * Die Daten stehen in `public/belegung.json` und werden zur Laufzeit geladen,
 * nicht einkompiliert. Dadurch kann die Datei auf dem Server ausgetauscht
 * werden, ohne die Seite neu zu bauen und zu deployen.
 *
 * Geladen wird nur im Browser: der Kalender ist kein Inhalt für Suchmaschinen,
 * und so braucht es weder eine absolute URL für den SSR-Request noch
 * Transfer-State zwischen Server und Client.
 */
@Injectable({ providedIn: 'root' })
export class AvailabilityStore {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly bookings = signal<Booking[]>([]);
  private readonly _status = signal<AvailabilityStatus>('loading');

  readonly status = this._status.asReadonly();

  /**
   * Belegte *Nächte* je Wohnung, als Menge von ISO-Tagen.
   *
   * Aus Zeiträumen werden einzelne Tage, weil die Oberfläche pro Kalenderfeld
   * genau eine Frage stellt ("ist dieser Tag belegt?") – das ist mit einem Set
   * eine Prüfung statt einer Schleife über alle Buchungen.
   */
  private readonly nightsByApartment = computed(() => {
    const map = new Map<string, Set<string>>();
    for (const booking of this.bookings()) {
      let nights = map.get(booking.apartmentId);
      if (!nights) map.set(booking.apartmentId, (nights = new Set<string>()));
      for (let day = booking.from; day < booking.to; day = addDays(day, 1)) nights.add(day);
    }
    return map;
  });

  constructor() {
    if (!this.isBrowser) return;
    this.http.get<AvailabilityFile | unknown[]>(SOURCE).subscribe({
      next: (data) => {
        this.bookings.set(parseBookings(data));
        this._status.set('ready');
      },
      error: () => this._status.set('error'),
    });
  }

  /** Ist diese Nacht in dieser Wohnung belegt? */
  isBooked(apartmentId: string, day: string): boolean {
    return this.nightsByApartment().get(apartmentId)?.has(day) ?? false;
  }

  /** Ist der ganze Zeitraum `from` (Anreise) bis `to` (Abreise) frei? */
  isRangeFree(apartmentId: string, from: string, to: string): boolean {
    const nights = this.nightsByApartment().get(apartmentId);
    if (!nights) return true;
    for (let day = from; day < to; day = addDays(day, 1)) {
      if (nights.has(day)) return false;
    }
    return true;
  }
}

/**
 * Macht aus dem Inhalt der JSON-Datei geprüfte Buchungen.
 *
 * Die Datei wird von Hand gepflegt, also ist sie eine unsichere Eingabe:
 * ein vertippter Zeitraum (`to` vor `from`) würde die Schleifen oben sonst
 * endlos laufen lassen. Fehlerhafte Einträge werden übersprungen statt die
 * ganze Seite scheitern zu lassen – ein Eintrag zu wenig ist harmlos, eine
 * leere Seite nicht.
 */
function parseBookings(data: AvailabilityFile | unknown[]): Booking[] {
  const raw = Array.isArray(data) ? data : Array.isArray(data?.belegungen) ? data.belegungen : [];

  return (raw as Partial<Booking>[]).filter((entry): entry is Booking => {
    const valid =
      !!entry &&
      typeof entry.apartmentId === 'string' &&
      isIsoDay(entry.from) &&
      isIsoDay(entry.to) &&
      entry.from < entry.to &&
      entry.to <= addDays(entry.from, MAX_NIGHTS);

    if (!valid) console.warn('belegung.json: Eintrag übersprungen', entry);
    return valid;
  });
}
