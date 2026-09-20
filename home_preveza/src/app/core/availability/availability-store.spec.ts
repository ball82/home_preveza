import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AvailabilityStore } from './availability-store';

/** Lädt den Store und beantwortet die Anfrage mit `body`. */
function loadWith(body: object): AvailabilityStore {
  const store = TestBed.inject(AvailabilityStore);
  TestBed.inject(HttpTestingController).expectOne('/belegung.json').flush(body);
  return store;
}

describe('AvailabilityStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('markiert den Anreisetag als belegt, den Abreisetag aber nicht', () => {
    const store = loadWith({
      belegungen: [{ apartmentId: 'wohnung-1', from: '2026-07-10', to: '2026-07-13' }],
    });

    expect(store.isBooked('wohnung-1', '2026-07-09')).toBe(false);
    expect(store.isBooked('wohnung-1', '2026-07-10')).toBe(true);
    expect(store.isBooked('wohnung-1', '2026-07-12')).toBe(true);
    // Abreisetag: hier kann der nächste Gast anreisen.
    expect(store.isBooked('wohnung-1', '2026-07-13')).toBe(false);
  });

  it('hält die Wohnungen auseinander', () => {
    const store = loadWith({
      belegungen: [{ apartmentId: 'wohnung-1', from: '2026-07-10', to: '2026-07-13' }],
    });

    expect(store.isBooked('wohnung-2', '2026-07-11')).toBe(false);
  });

  it('erkennt eine belegte Nacht mitten im gewählten Zeitraum', () => {
    const store = loadWith({
      belegungen: [{ apartmentId: 'wohnung-1', from: '2026-07-20', to: '2026-07-22' }],
    });

    expect(store.isRangeFree('wohnung-1', '2026-07-15', '2026-07-20')).toBe(true);
    expect(store.isRangeFree('wohnung-1', '2026-07-15', '2026-07-25')).toBe(false);
    // Anreise am Abreisetag der Vorbuchung ist erlaubt.
    expect(store.isRangeFree('wohnung-1', '2026-07-22', '2026-07-25')).toBe(true);
  });

  it('überspringt fehlerhafte Einträge, statt die Seite lahmzulegen', () => {
    const store = loadWith({
      belegungen: [
        { apartmentId: 'wohnung-1', from: '2026-07-13', to: '2026-07-10' }, // to vor from
        { apartmentId: 'wohnung-1', from: '10.07.2026', to: '13.07.2026' }, // falsches Format
        { apartmentId: 'wohnung-1', from: '2026-08-01', to: '2030-08-01' }, // unplausibel lang
        { apartmentId: 'wohnung-1', from: '2026-09-01', to: '2026-09-03' }, // gültig
      ],
    });

    expect(store.status()).toBe('ready');
    expect(store.isBooked('wohnung-1', '2026-09-01')).toBe(true);
    expect(store.isBooked('wohnung-1', '2026-08-15')).toBe(false);
    expect(store.isBooked('wohnung-1', '2026-07-11')).toBe(false);
  });

  it('meldet einen Fehler, wenn die Datei fehlt', () => {
    const store = TestBed.inject(AvailabilityStore);
    TestBed.inject(HttpTestingController)
      .expectOne('/belegung.json')
      .flush('not found', { status: 404, statusText: 'Not Found' });

    expect(store.status()).toBe('error');
    // Ohne Daten gilt alles als frei – die Anfrage per Mail bleibt möglich.
    expect(store.isBooked('wohnung-1', '2026-07-11')).toBe(false);
  });
});
