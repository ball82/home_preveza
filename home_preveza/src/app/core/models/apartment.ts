import { GalleryImage } from './gallery-image';

/**
 * Eine der vier Wohnungen im Haus.
 * `id` verbindet die Wohnung mit dem Hotspot im Hero-Bild und ist der Schlüssel,
 * über den Hero und Galerie den Dialog mit der Wohnungs-Galerie öffnen.
 */
export interface Apartment {
  id: string;
  name: string;
  size: string;
  /** 'Erdgeschoss' oder 'Obergeschoss' – erscheint als Badge auf der Karte. */
  floor: string;
  /** Kurzbeschreibung auf der Karte (ein bis zwei Sätze). */
  text: string;
  /** Bild für die Karte in der Übersicht. Fehlt, solange keine Fotos vorliegen. */
  cover?: GalleryImage;
  /** Alle Bilder der Wohnung – Inhalt des Dialogs. Leer, solange Fotos fehlen. */
  images: GalleryImage[];
  /** Hinweis im Dialog und auf der Karte, wenn `images` noch leer ist. */
  pendingNote?: string;
}
