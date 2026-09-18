import { Apartment } from '../models';

/**
 * Die vier Wohnungen des Hauses – Grundlage für die Galerie-Übersicht und
 * (später) für den Dialog mit der jeweiligen Wohnungs-Galerie.
 *
 * Die Bilder sind über die Nummer im Dateinamen der Wohnung zugeordnet
 * (z. B. `wohnen_2.2.jpeg` -> Wohnung 2).
 *
 * Die Reihenfolge bildet das Haus ab und bestimmt die Kacheln der Galerie:
 *   Wohnung 1 | Wohnung 3   (Obergeschoss, links | rechts)
 *   Wohnung 2 | Wohnung 4   (Erdgeschoss,  links | rechts)
 */
export const APARTMENTS: Apartment[] = [
  {
    id: 'wohnung-1',
    name: 'Wohnung 1',
    size: '95 m²',
    floor: 'Obergeschoss',
    text: 'Grosse Wohnung mit zwei Schlafzimmern, separatem Essbereich und zwei Balkonen.',
    cover: { src: 'img/wohnen_1.jpg', alt: 'Wohnzimmer der Wohnung 1' },
    images: [
      { src: 'img/wohnen_1.jpg', alt: 'Wohnzimmer' },
      { src: 'img/wohnen_1-2.jpeg', alt: 'Wohnzimmer, Blick zum Balkon' },
      { src: 'img/wohnen_balkon_1.jpeg', alt: 'Balkon am Wohnzimmer' },
      { src: 'img/kueche_1.jpeg', alt: 'Küche' },
      { src: 'img/essen_1.jpg', alt: 'Essbereich' },
      { src: 'img/essen_1.2.jpeg', alt: 'Essbereich' },
      { src: 'img/schlafen_goss_1.jpg', alt: 'Grosses Schlafzimmer' },
      { src: 'img/schlafen_gross_1.2.jpg', alt: 'Grosses Schlafzimmer' },
      { src: 'img/schlafen_gorss_balkon_1.jpg', alt: 'Balkon am grossen Schlafzimmer' },
      { src: 'img/schlafen_gross_balkon_1.1.jpg', alt: 'Balkon am grossen Schlafzimmer' },
      { src: 'img/schlafen_gross_balkon_1.2.jpeg', alt: 'Aussicht vom Balkon' },
      { src: 'img/schlafe_klein_1.jpg', alt: 'Kleines Schlafzimmer' },
      { src: 'img/bad_1.jpg', alt: 'Bad' },
      { src: 'img/bad_1.2.jpeg', alt: 'Bad' },
      { src: 'img/dusche_1.jpg', alt: 'Dusche' },
      { src: 'img/eingang_1.jpeg', alt: 'Eingang' },
      { src: 'img/treppen_eingang_1.jpeg', alt: 'Treppe zum Eingang' },
      { src: 'img/aussen_1.jpeg', alt: 'Aussenansicht' },
    ],
  },
  {
    id: 'wohnung-3',
    name: 'Wohnung 3',
    size: '95 m²',
    floor: 'Obergeschoss',
    text: 'Grosse Wohnung mit gleichem Grundriss wie Wohnung 1 – Fotos folgen in Kürze.',
    // TODO: Für Wohnung 3 liegen noch keine eigenen Fotos vor. Solange zeigen wir
    // die Aussen- und Gemeinschaftsbereiche; Bilder hier ersetzen, sobald vorhanden.
    cover: { src: 'img/haus_aussen_front_1.jpg', alt: 'Hausfront – Wohnung 3 im Obergeschoss' },
    images: [
      { src: 'img/haus_aussen_front_1.jpg', alt: 'Hausfront' },
      { src: 'img/haus_aussen_front.jpg', alt: 'Hausfront' },
      { src: 'img/treppem_eg_og_1.jpeg', alt: 'Treppe vom Erdgeschoss ins Obergeschoss' },
    ],
  },
  {
    id: 'wohnung-2',
    name: 'Wohnung 2',
    size: '45 m²',
    floor: 'Erdgeschoss',
    text: 'Kompakte Wohnung mit eigenem Eingang, Schlafzimmer und Wohnbereich.',
    cover: { src: 'img/wohnen_2.2.jpeg', alt: 'Wohnbereich der Wohnung 2' },
    images: [
      { src: 'img/wohnen_2.2.jpeg', alt: 'Wohnbereich' },
      { src: 'img/schlafen_2.jpeg', alt: 'Schlafzimmer' },
      { src: 'img/schlafen_2.2.jpeg', alt: 'Schlafzimmer' },
      { src: 'img/bad_2.jpeg', alt: 'Bad' },
      { src: 'img/eingang_2.jpeg', alt: 'Eingang' },
    ],
  },
  {
    id: 'wohnung-4',
    name: 'Wohnung 4',
    size: '45 m²',
    floor: 'Erdgeschoss',
    text: 'Kompakte Wohnung mit eigener Küche, Schlafzimmer und separatem Zugang.',
    cover: { src: 'img/wohnen_4.jpeg', alt: 'Wohnbereich der Wohnung 4' },
    images: [
      { src: 'img/wohnen_4.jpeg', alt: 'Wohnbereich' },
      { src: 'img/kueche_4.jpeg', alt: 'Küche' },
      { src: 'img/schlafen_4.jpeg', alt: 'Schlafzimmer' },
      { src: 'img/schlafen_4.2.jpeg', alt: 'Schlafzimmer' },
      { src: 'img/bad_4.jpeg', alt: 'Bad' },
      { src: 'img/eingang_4.jpeg', alt: 'Eingang' },
      { src: 'img/treppen_eingang_4.jpeg', alt: 'Treppe zum Eingang' },
    ],
  },
];
