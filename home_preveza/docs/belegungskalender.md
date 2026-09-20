# Belegungskalender

Zeigt auf der Startseite unter `#verfuegbarkeit`, welche Nächte pro Wohnung frei
sind. Der Besucher wählt die Wohnung im Dropdown, klickt Anreise- und Abreisetag
an und bekommt daraus eine vorausgefüllte Anfrage-Mail.

**Das ist keine Buchung.** Es gibt kein Backend, das einen Zeitraum reservieren
könnte. Verbindlich wird ein Aufenthalt erst mit der Bestätigung per E-Mail.

---

## Teil 1 – Belegung pflegen

Für alle, die keine Zeile Code anfassen wollen.

Alle belegten Zeiträume stehen in einer einzigen Datei auf dem Webserver:

```
belegung.json
```

Die Datei kann direkt ersetzt werden. Die Website muss dafür **nicht** neu
gebaut oder neu hochgeladen werden – ein Neuladen der Seite im Browser genügt.

### Aufbau

```json
{
  "hinweis": "… Text, wird nicht angezeigt, dient nur als Erinnerung …",
  "belegungen": [
    { "apartmentId": "wohnung-1", "from": "2026-09-26", "to": "2026-10-04" },
    { "apartmentId": "wohnung-2", "from": "2026-10-02", "to": "2026-10-09" }
  ]
}
```

| Feld          | Bedeutung                                                              |
| ------------- | ---------------------------------------------------------------------- |
| `apartmentId` | Welche Wohnung: `wohnung-1`, `wohnung-2`, `wohnung-3` oder `wohnung-4` |
| `from`        | **Anreisetag** – dieser Tag ist belegt                                 |
| `to`          | **Abreisetag** – dieser Tag ist wieder frei                            |

Datum immer im Format `JJJJ-MM-TT`, also Jahr-Monat-Tag mit Bindestrichen.

### Der wichtigste Punkt: gezählt werden Nächte

`from: 2026-07-10`, `to: 2026-07-13` bedeutet **drei belegte Nächte**
(10., 11., 12. Juli). Am 13. Juli kann bereits der nächste Gast anreisen.

Das ist die übliche Zählweise in der Vermietung. Wer stattdessen den Abreisetag
mit einträgt, verschenkt pro Buchung einen Tag.

### Regeln

- Jede Buchung ist eine eigene Zeile in der Liste `belegungen`.
- Zeilen werden mit Komma getrennt, die **letzte Zeile ohne Komma**.
- Vergangene Zeiträume dürfen stehen bleiben – der Kalender zeigt ohnehin keine
  vergangenen Tage.
- Reihenfolge egal.

### Wenn etwas nicht stimmt

Fehlerhafte Einträge werden übersprungen, nicht angezeigt – die Seite bleibt
heil. Wenn ein eingetragener Zeitraum im Kalender **nicht** als belegt erscheint,
liegt es fast immer an einem davon:

- Datum im falschen Format (`10.07.2026` statt `2026-07-10`)
- `to` liegt vor `from`
- Tippfehler in der Jahreszahl, dadurch ein Zeitraum über mehr als ein Jahr
- falsche `apartmentId`

Die Browser-Konsole (F12) nennt in solchen Fällen den betroffenen Eintrag.

Ist die Datei gar nicht erreichbar, zeigt der Kalender statt Fehlermeldungen
einen Hinweis, dass der Zeitraum von Hand geprüft wird. Die Seite funktioniert
weiter.

---

## Teil 2 – Wie es technisch läuft

Drei getrennte Verantwortlichkeiten:

```
core/availability/calendar-dates.ts      Datumsrechnen, ohne Angular
core/availability/availability-store.ts  Daten laden, prüfen, "frei?" beantworten
sections/availability/                   Darstellung und Auswahl
```

Die Trennung ist der Zweck: die Datumslogik ist ohne Framework testbar, und ein
Wechsel der Datenquelle betrifft nur den Store.

### Ablauf

1. `AvailabilityStore` (root-Singleton) lädt beim Start `/belegung.json` per
   `HttpClient`.
2. `parseBookings` prüft jeden Eintrag und wirft ungültige raus.
3. Aus den Zeiträumen wird pro Wohnung ein `Set` einzelner belegter Nächte.
   Grund: die Oberfläche stellt pro Kalenderfeld genau eine Frage – „ist dieser
   Tag belegt?". Das ist mit einem Set eine Prüfung statt einer Schleife über
   alle Buchungen.
4. Die Section baut das Monatsraster als `computed`. Sobald die Daten da sind,
   rechnet es von selbst neu und der Kalender färbt sich ein.

### Drei Entscheidungen, die man kennen sollte

**Datum als String, nicht als `Date`.** Alles ist `YYYY-MM-DD`, intern wird in
UTC gerechnet. Mit lokaler Zeitzone landet man bei der Sommerzeit-Umstellung auf
dem falschen Tag – dafür gibt es einen Test in `calendar-dates.spec.ts`.
Nebeneffekt: zwei Tage lassen sich mit `<` vergleichen.

**Geladen wird nur im Browser** (`isPlatformBrowser`-Guard im Store). Der
Kalender ist kein Inhalt für Suchmaschinen. Dadurch braucht es weder eine
absolute URL für den SSR-Request noch Transfer-State zwischen Server und Client.
Preis: ein kurzer Ladezustand, im Raster als `.is-loading` sichtbar.

**Die JSON-Datei gilt als unsichere Eingabe.** Sie wird von Hand gepflegt, also
wird sie validiert. Ein vertipptes `to` vor `from` würde die Tag-für-Tag-Schleife
sonst endlos laufen lassen und den Browser einfrieren. Zusätzlich begrenzt
`MAX_NIGHTS` einen Zeitraum auf 366 Nächte.

### Auswahl-Logik

`Availability.select()` – erster Klick setzt die Anreise, zweiter die Abreise.
Eine **neue** Auswahl beginnt, wenn noch nichts gewählt ist, der Zeitraum schon
vollständig war, der Klick vor der bisherigen Anreise liegt, oder dazwischen eine
belegte Nacht läge. Ein Wohnungswechsel löscht die Auswahl, weil derselbe
Zeitraum in der anderen Wohnung belegt sein kann.

### Pfad der Datei

Der Store lädt `/belegung.json` **absolut ab Domain-Wurzel**, nicht relativ –
sonst würde die Datei auf Unterseiten wie `/room-1` nicht gefunden. Wird die
Seite in einem Unterordner gehostet, muss die Konstante `SOURCE` in
`availability-store.ts` angepasst werden.

Im Repo liegt die Datei unter `public/belegung.json`; `ng build` kopiert sie
unverändert nach `dist/home_preveza/browser/`.

### Tests

```bash
ng test
```

Getestet wird die Geschäftslogik, nicht die Darstellung:

- `calendar-dates.spec.ts` – Monats- und Jahresgrenzen, Sommerzeit, Schaltjahr,
  Nächte-Zählung, Montag-first-Raster
- `availability-store.spec.ts` – Anreise belegt / Abreise frei, Trennung der
  Wohnungen, belegte Nacht im Zeitraum, fehlerhafte Einträge, fehlende Datei

### Später auf iCal wechseln

Wenn parallel über Airbnb oder Booking.com vermietet wird, lohnt sich der
automatische Abgleich. Auszutauschen ist dann nur der Store: den iCal-Export der
Plattform über den bestehenden Express-Server (`src/server.ts`) als Proxy holen
– direkt aus dem Browser geht es wegen CORS nicht – parsen, cachen, und in
dieselben `Booking`-Objekte umwandeln. `calendar-dates.ts` und die Section
bleiben unverändert.

Das lohnt sich erst, wenn wirklich über Plattformen vermietet wird. Solange die
Belegung ohnehin von Hand geführt wird, ist die JSON-Datei die einfachere und
robustere Lösung.
