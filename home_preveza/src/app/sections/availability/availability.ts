import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { AvailabilityStore } from '../../core/availability/availability-store';
import {
  addMonths,
  formatDe,
  MONTH_NAMES_DE,
  monthOf,
  monthWeeks,
  nightsBetween,
  todayIso,
  WEEKDAYS_DE,
} from '../../core/availability/calendar-dates';
import { SectionLabel } from '../../shared/ui/section-label/section-label';

/** Ein Feld im Kalenderraster, fertig aufbereitet für die Darstellung. */
interface CalendarDay {
  iso: string;
  /** Tag im Monat, wie er im Feld steht. */
  number: number;
  past: boolean;
  booked: boolean;
  isArrival: boolean;
  isDeparture: boolean;
  /** Liegt zwischen gewählter Anreise und Abreise. */
  inRange: boolean;
}

/** Wie weit im Voraus man blättern kann. */
const MAX_MONTHS_AHEAD = 24;

/**
 * Belegungskalender: ein Kalender, die Wohnung wird oben im Dropdown gewählt.
 *
 * Der Besucher sieht auf einen Blick, welche Nächte frei sind, und kann durch
 * zwei Klicks (Anreise, Abreise) einen Zeitraum wählen. Daraus entsteht eine
 * vorausgefüllte E-Mail – das ist bewusst *keine* Buchung: es gibt kein
 * Backend, das einen Zeitraum verbindlich reservieren könnte.
 */
@Component({
  selector: 'app-availability',
  imports: [SectionLabel],
  templateUrl: './availability.html',
  styleUrl: './availability.scss',
})
export class Availability {
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly note = input.required<string>();
  readonly buttonLabel = input.required<string>();
  /** Nur Id und Name – der Kalender braucht nicht die ganze Wohnung. */
  readonly apartments = input.required<{ id: string; name: string }[]>();
  readonly email = input.required<string>();

  private readonly store = inject(AvailabilityStore);

  protected readonly status = this.store.status;
  protected readonly weekdays = WEEKDAYS_DE;
  protected readonly formatDe = formatDe;

  private readonly today = todayIso();
  private readonly currentMonth = monthOf(this.today);

  /** Gewählte Wohnung; folgt dem Input, bis der Besucher selbst etwas wählt. */
  protected readonly apartmentId = linkedSignal(() => this.apartments()[0]?.id ?? '');

  /** Angezeigter Monat. */
  protected readonly month = signal(this.currentMonth);

  protected readonly arrival = signal<string | null>(null);
  protected readonly departure = signal<string | null>(null);

  protected readonly monthTitle = computed(() => {
    const { year, month } = this.month();
    return `${MONTH_NAMES_DE[month]} ${year}`;
  });

  protected readonly canGoBack = computed(
    () => this.monthIndex(this.month()) > this.monthIndex(this.currentMonth),
  );

  protected readonly canGoForward = computed(
    () => this.monthIndex(this.month()) < this.monthIndex(this.currentMonth) + MAX_MONTHS_AHEAD,
  );

  /**
   * Das Raster des angezeigten Monats.
   *
   * Liest die Belegung aus dem Store; sobald die JSON-Datei geladen ist,
   * rechnet dieses Computed von selbst neu und der Kalender färbt sich ein.
   */
  protected readonly weeks = computed<(CalendarDay | null)[][]>(() => {
    const { year, month } = this.month();
    const apartmentId = this.apartmentId();
    const arrival = this.arrival();
    const departure = this.departure();

    return monthWeeks(year, month).map((week) =>
      week.map((iso) =>
        iso === null
          ? null
          : {
              iso,
              number: Number(iso.slice(8)),
              past: iso < this.today,
              booked: this.store.isBooked(apartmentId, iso),
              isArrival: iso === arrival,
              isDeparture: iso === departure,
              inRange: !!arrival && !!departure && iso > arrival && iso < departure,
            },
      ),
    );
  });

  protected readonly nights = computed(() => {
    const from = this.arrival();
    const to = this.departure();
    return from && to ? nightsBetween(from, to) : 0;
  });

  protected readonly apartmentName = computed(
    () => this.apartments().find((a) => a.id === this.apartmentId())?.name ?? '',
  );

  /** Vorausgefüllte Anfrage-Mail; `null`, solange kein vollständiger Zeitraum gewählt ist. */
  protected readonly requestLink = computed(() => {
    const from = this.arrival();
    const to = this.departure();
    if (!from || !to) return null;

    const subject = `Anfrage ${this.apartmentName()}: ${formatDe(from)} – ${formatDe(to)}`;
    const body =
      `Guten Tag\n\nIch interessiere mich für ${this.apartmentName()} ` +
      `vom ${formatDe(from)} bis ${formatDe(to)} (${this.nights()} Nächte).\n\n` +
      `Freundliche Grüsse\n`;

    return `mailto:${this.email()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /** Wohnung gewechselt: die alte Auswahl kann in der neuen Wohnung belegt sein. */
  protected changeApartment(apartmentId: string): void {
    this.apartmentId.set(apartmentId);
    this.clear();
  }

  protected shiftMonth(offset: number): void {
    this.month.set(addMonths(this.month(), offset));
  }

  /** Erster Klick setzt die Anreise, zweiter die Abreise. */
  protected select(day: CalendarDay): void {
    if (day.past || day.booked) return;

    const arrival = this.arrival();
    const startsNewRange =
      !arrival || // noch nichts gewählt
      !!this.departure() || // Zeitraum war vollständig
      day.iso <= arrival || // Klick liegt vor der bisherigen Anreise
      !this.store.isRangeFree(this.apartmentId(), arrival, day.iso); // belegte Nacht dazwischen

    if (startsNewRange) {
      this.arrival.set(day.iso);
      this.departure.set(null);
      return;
    }
    this.departure.set(day.iso);
  }

  protected clear(): void {
    this.arrival.set(null);
    this.departure.set(null);
  }

  /** Monate seit Jahr 0 – macht zwei Monate vergleichbar, ohne Jahr und Monat einzeln zu prüfen. */
  private monthIndex(month: { year: number; month: number }): number {
    return month.year * 12 + month.month;
  }
}
