import { Apartment } from '../models';

/**
 * Die vier Wohnungen des Hauses – Grundlage für die Galerie-Übersicht und für
 * den Dialog mit der jeweiligen Wohnungs-Galerie.
 *
 * Die Bilder sind über die Nummer im Dateinamen der Wohnung zugeordnet
 * (z. B. `wohnen_2.2.webp` -> Wohnung 2). Die Ziffer *nach* dem Punkt ist nur
 * eine Durchnummerierung mehrerer Aufnahmen desselben Raums.
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
    cover: { src: 'img/wohnen_1.2.webp', thumb: 'img/thumbs/wohnen_1.2.webp', alt: 'Wohnzimmer der Wohnung 1' },
    images: [
      { src: 'img/wohnen_1.2.webp', thumb: 'img/thumbs/wohnen_1.2.webp', alt: 'Wohnzimmer, Blick zum Balkon' },
      { src: 'img/wohnen_1.webp', thumb: 'img/thumbs/wohnen_1.webp', alt: 'Wohnzimmer' },
      { src: 'img/wohnen_balkon_1.webp', thumb: 'img/thumbs/wohnen_balkon_1.webp', alt: 'Balkon am Wohnzimmer' },
      { src: 'img/kueche_1.webp', thumb: 'img/thumbs/kueche_1.webp', alt: 'Küche' },
      { src: 'img/essen_1.webp', thumb: 'img/thumbs/essen_1.webp', alt: 'Essbereich' },
      { src: 'img/essen_1.2.webp', thumb: 'img/thumbs/essen_1.2.webp', alt: 'Essbereich' },
      { src: 'img/schlafen_goss_1.webp', thumb: 'img/thumbs/schlafen_goss_1.webp', alt: 'Grosses Schlafzimmer' },
      { src: 'img/schlafen_gross_1.2.webp', thumb: 'img/thumbs/schlafen_gross_1.2.webp', alt: 'Grosses Schlafzimmer' },
      { src: 'img/schlafen_gorss_balkon_1.webp', thumb: 'img/thumbs/schlafen_gorss_balkon_1.webp', alt: 'Balkon am grossen Schlafzimmer' },
      { src: 'img/schlafen_gross_balkon_1.1.webp', thumb: 'img/thumbs/schlafen_gross_balkon_1.1.webp', alt: 'Balkon am grossen Schlafzimmer' },
      { src: 'img/schlafen_gross_balkon_1.2.webp', thumb: 'img/thumbs/schlafen_gross_balkon_1.2.webp', alt: 'Aussicht vom Balkon' },
      { src: 'img/schlafe_klein_1.webp', thumb: 'img/thumbs/schlafe_klein_1.webp', alt: 'Kleines Schlafzimmer' },
      { src: 'img/bad_1.webp', thumb: 'img/thumbs/bad_1.webp', alt: 'Bad' },
      { src: 'img/bad_1.2.webp', thumb: 'img/thumbs/bad_1.2.webp', alt: 'Bad' },
      { src: 'img/dusche_1.webp', thumb: 'img/thumbs/dusche_1.webp', alt: 'Dusche' },
      { src: 'img/eingang_1.webp', thumb: 'img/thumbs/eingang_1.webp', alt: 'Eingang' },
      { src: 'img/treppen_eingang_1.webp', thumb: 'img/thumbs/treppen_eingang_1.webp', alt: 'Treppe zum Eingang' },
      { src: 'img/treppem_eg_og_1.webp', thumb: 'img/thumbs/treppem_eg_og_1.webp', alt: 'Treppe vom Erdgeschoss ins Obergeschoss' },
      { src: 'img/aussen_1.webp', thumb: 'img/thumbs/aussen_1.webp', alt: 'Aussenansicht' },
    ],
  },
  {
    id: 'wohnung-3',
    name: 'Wohnung 3',
    size: '95 m²',
    floor: 'Obergeschoss',
    text: 'Grosse Wohnung mit gleichem Grundriss wie Wohnung 1.',
    // Für Wohnung 3 liegen noch keine Fotos vor: kein `cover`, keine `images`.
    // Sobald die Bilder da sind, hier eintragen – Karte und Dialog zeigen sie dann
    // automatisch statt des Hinweises.
    images: [],
    pendingNote:
      'Für Wohnung 3 fotografieren wir gerade noch – die Bilder folgen in Kürze. ' +
      'Der Grundriss entspricht Wohnung 1, deren Galerie Ihnen schon jetzt einen ' +
      'guten Eindruck gibt.',
  },
  {
    id: 'wohnung-2',
    name: 'Wohnung 2',
    size: '45 m²',
    floor: 'Erdgeschoss',
    text: 'Kompakte Wohnung mit eigenem Eingang, Schlafzimmer und Wohnbereich.',
    cover: { src: 'img/eingang_2.webp', thumb: 'img/thumbs/eingang_2.webp', alt: 'Eingang der Wohnung 2' },
    images: [
      { src: 'img/eingang_2.webp', thumb: 'img/thumbs/eingang_2.webp', alt: 'Eingang' },
      { src: 'img/wohnen_2.2.webp', thumb: 'img/thumbs/wohnen_2.2.webp', alt: 'Wohnbereich' },
      { src: 'img/schlafen_2.webp', thumb: 'img/thumbs/schlafen_2.webp', alt: 'Schlafzimmer' },
      { src: 'img/schlafen_2.2.webp', thumb: 'img/thumbs/schlafen_2.2.webp', alt: 'Schlafzimmer' },
      { src: 'img/bad_2.webp', thumb: 'img/thumbs/bad_2.webp', alt: 'Bad' },
    ],
  },
  {
    id: 'wohnung-4',
    name: 'Wohnung 4',
    size: '45 m²',
    floor: 'Erdgeschoss',
    text: 'Kompakte Wohnung mit eigener Küche, Schlafzimmer und separatem Zugang.',
    cover: { src: 'img/eingang_4.webp', thumb: 'img/thumbs/eingang_4.webp', alt: 'Eingang der Wohnung 4' },
    images: [
      { src: 'img/eingang_4.webp', thumb: 'img/thumbs/eingang_4.webp', alt: 'Eingang' },
      { src: 'img/treppen_eingang_4.webp', thumb: 'img/thumbs/treppen_eingang_4.webp', alt: 'Treppe zum Eingang' },
      { src: 'img/wohnen_4.webp', thumb: 'img/thumbs/wohnen_4.webp', alt: 'Wohnbereich' },
      { src: 'img/kueche_4.webp', thumb: 'img/thumbs/kueche_4.webp', alt: 'Küche' },
      { src: 'img/schlafen_4.webp', thumb: 'img/thumbs/schlafen_4.webp', alt: 'Schlafzimmer' },
      { src: 'img/schlafen_4.2.webp', thumb: 'img/thumbs/schlafen_4.2.webp', alt: 'Schlafzimmer' },
      { src: 'img/bad_4.webp', thumb: 'img/thumbs/bad_4.webp', alt: 'Bad' },
    ],
  },
];
