/** Anklickbare Fläche im Hero-Bild. Alle Masse in % der *Bildfläche*, nicht der Hero-Box. */
export interface Hotspot {
  /** Id der zugehörigen Wohnung – Sprungziel zur Karte in der Galerie. */
  id: string;
  name: string;
  size: string;
  top: number;
  left: number;
  width: number;
  height: number;
}
