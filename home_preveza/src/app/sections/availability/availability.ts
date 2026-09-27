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

/** Grenzen der Gästezähler. Mindestens ein Erwachsener, sonst gibt es keine Anfrage. */
const MIN_ADULTS = 1;
const MAX_ADULTS = 12;
const MAX_CHILDREN = 12;

/**
 * Anfrage-Abschnitt: Zeitraum prüfen, Gäste angeben, Kontakt aufnehmen.
 *
 * Die drei Schritte stehen bewusst in einem einzigen Abschnitt, weil sie eine
 * einzige Handlung sind: der Besucher sieht, ob sein Wunschtermin frei ist,
 * sagt mit wie vielen Personen er kommt – und erst dann wird der Kontakt-Button
 * klickbar. Alles Gewählte steht anschliessend in der vorausgefüllten E-Mail.
 *
 * Das ist bewusst *keine* Buchung: es gibt kein Backend, das einen Zeitraum
 * verbindlich reservieren könnte.
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
  readonly image = input.required<{ src: string; alt: string }>();
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

  protected readonly adults = signal(2);
  protected readonly children = signal(0);

  protected readonly canRemoveAdult = computed(() => this.adults() > MIN_ADULTS);
  protected readonly canAddAdult = computed(() => this.adults() < MAX_ADULTS);
  protected readonly canRemoveChild = computed(() => this.children() > 0);
  protected readonly canAddChild = computed(() => this.children() < MAX_CHILDREN);

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

  /** Gästezahl als Text – einmal gebaut, dann in Zusammenfassung und E-Mail gleich. */
  protected readonly guestsText = computed(() => {
    const adults = this.adults();
    const children = this.children();
    const parts = [`${adults} ${adults === 1 ? 'Erwachsener' : 'Erwachsene'}`];
    if (children > 0) parts.push(`${children} ${children === 1 ? 'Kind' : 'Kinder'}`);
    return parts.join(', ');
  });

  /**
   * Vorausgefüllte Anfrage-Mail; `null`, solange kein vollständiger Zeitraum
   * gewählt ist. Genau dann ist auch der Kontakt-Button gesperrt.
   */
  protected readonly requestLink = computed(() => {
    const from = this.arrival();
    const to = this.departure();
    if (!from || !to) return null;

    const nights = this.nights();
    const subject = `Anfrage ${this.apartmentName()}: ${formatDe(from)} – ${formatDe(to)}`;
    const body =
      `Guten Tag\n\n` +
      `Ich interessiere mich für folgenden Aufenthalt:\n\n` +
      `Wohnung: ${this.apartmentName()}\n` +
      `Anreise: ${formatDe(from)}\n` +
      `Abreise: ${formatDe(to)}\n` +
      `Nächte: ${nights}\n` +
      `Erwachsene: ${this.adults()}\n` +
      `Kinder: ${this.children()}\n\n` +
      `Ist der Zeitraum noch frei?\n\n` +
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

  protected changeAdults(delta: number): void {
    this.adults.update((value) => this.clamp(value + delta, MIN_ADULTS, MAX_ADULTS));
  }

  protected changeChildren(delta: number): void {
    this.children.update((value) => this.clamp(value + delta, 0, MAX_CHILDREN));
  }

  /** Nur der Zeitraum wird gelöscht – die Gästezahl bleibt für die nächste Suche stehen. */
  protected clear(): void {
    this.arrival.set(null);
    this.departure.set(null);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /** Monate seit Jahr 0 – macht zwei Monate vergleichbar, ohne Jahr und Monat einzeln zu prüfen. */
  private monthIndex(month: { year: number; month: number }): number {
    return month.year * 12 + month.month;
  }
}
