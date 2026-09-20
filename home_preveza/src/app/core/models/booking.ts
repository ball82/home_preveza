/**
 * Ein belegter Zeitraum einer Wohnung.
 *
 * Datumsangaben sind ISO-Tage (`YYYY-MM-DD`). Bewusst Strings und keine
 * `Date`-Objekte: so gibt es keine Zeitzonen-Verschiebung, und zwei Tage lassen
 * sich einfach mit `<` vergleichen.
 *
 * Gezählt wird in *Nächten*, wie in der Hotellerie üblich:
 * `from` ist der Anreisetag (belegt), `to` der Abreisetag (wieder frei).
 * `2026-07-10` bis `2026-07-13` sind also drei belegte Nächte, und am 13. kann
 * der nächste Gast anreisen.
 */
export interface Booking {
  /** Passt zu `Apartment.id`, z. B. `wohnung-1`. */
  apartmentId: string;
  /** Anreisetag, belegt. */
  from: string;
  /** Abreisetag, nicht mehr belegt. */
  to: string;
}
