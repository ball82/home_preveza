import { GalleryImage } from './gallery-image';

/**
 * Eine der vier Wohnungen im Haus.
 * `id` verbindet die Wohnung mit dem Hotspot im Hero-Bild und dient später
 * als Anker bzw. Schlüssel für den Dialog mit der Wohnungs-Galerie.
 */
export interface Apartment {
  id: string;
  name: string;
  size: string;
  /** 'Erdgeschoss' oder 'Obergeschoss' – erscheint als Badge auf der Karte. */
  floor: string;
  /** Kurzbeschreibung auf der Karte (ein bis zwei Sätze). */
  text: string;
  /** Bild für die Karte in der Übersicht. */
  cover: GalleryImage;
  /** Alle Bilder der Wohnung – Inhalt des späteren Dialogs. */
  images: GalleryImage[];
}
