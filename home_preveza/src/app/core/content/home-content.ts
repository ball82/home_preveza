import { Feature, Hotspot } from '../models';
import { APARTMENTS } from './apartments-content';

/**
 * Lage der vier Wohnungen im Hero-Bild.
 *
 * Prozentwerte beziehen sich auf hero.webp (1448 x 1086 px), nicht auf die
 * Hero-Box. Gemessen am Bild:
 *   Dachkante 25.7 % · Decke Erdgeschoss 60.8 % · Rasenkante 69.1 %
 *   Trennwand zwischen linker und rechter Haushälfte 42.7 %
 */
const HOTSPOT_GEOMETRY: Record<string, Pick<Hotspot, 'top' | 'left' | 'width' | 'height'>> = {
  'wohnung-1': { top: 25.7, left: 20.8, width: 21.7, height: 35.1 },
  'wohnung-3': { top: 25.7, left: 42.9, width: 19.4, height: 35.1 },
  'wohnung-2': { top: 60.8, left: 20.8, width: 21.7, height: 8.3 },
  'wohnung-4': { top: 60.8, left: 42.9, width: 19.4, height: 8.3 },
};

/**
 * Alle Texte und Bilder der Startseite an einer Stelle.
 * Ändert der Kunde eine Quadratmeterzahl, wird sie hier geändert – nicht im Template.
 */
export const HOME = {
  hero: {
    image: { src: 'img/hero.webp', alt: 'Haus Aussenansicht mit Garten' },
    eyebrow: 'ZU VERMIETEN',
    title: 'Ferienhaus in Preveza mit Garten und Terrasse',
    text:
      'Geniessen Sie Ihren Urlaub in einem gepflegten Haus mit grossem Garten, sonnigen ' +
      'Balkonen und nur wenigen Minuten vom Meer entfernt. Ideal für Familien und Paare, ' +
      'die Ruhe und Komfort suchen.',
    cta: { label: 'Jetzt Anfragen', fragment: 'kontakt' },
    // Name und Grösse kommen aus den Wohnungen, damit beides nur an einer Stelle steht.
    hotspots: APARTMENTS.map((apartment) => ({
      id: apartment.id,
      name: apartment.name,
      size: apartment.size,
      ...HOTSPOT_GEOMETRY[apartment.id],
    })) satisfies Hotspot[],
  },

  features: [
    { icon: '🛏️', title: 'Gemütliche Zimmer', text: 'Helle Schlafzimmer mit viel Platz zum Entspannen' },
    { icon: '📍', title: 'Ruhige Lage', text: 'Zentral in Preveza und dennoch im Grünen' },
    { icon: '🌿', title: 'Grosser Garten', text: 'Terrasse und Garten für erholsame Sommerabende' },
    { icon: '🚗', title: 'Eigener Parkplatz', text: 'Bequemes Parkieren direkt beim Haus' },
  ] satisfies Feature[],

  gallery: {
    label: 'DIE WOHNUNGEN',
    title: 'Vier Wohnungen unter einem Dach',
    text:
      'Zwei grosse Wohnungen im Obergeschoss und zwei kompakte im Erdgeschoss – ' +
      'jede mit eigenem Zugang. Wählen Sie eine Wohnung, um alle Bilder zu sehen.',
    apartments: APARTMENTS,
  },

  location: {
    label: 'DIE LAGE',
    title: 'Preveza – zwischen Ionischem Meer und Ambrakischem Golf',
    text:
      'Das Haus liegt ruhig in Preveza, wenige Minuten vom Zentrum und von den Stränden ' +
      'entfernt. Tavernen, Einkaufsmöglichkeiten und der Hafen sind schnell erreicht.',
    facts: [
      { icon: '🏖️', text: 'Wenige Minuten bis zum Strand' },
      { icon: '🍽️', text: 'Tavernen und Altstadt in der Nähe' },
      { icon: '✈️', text: 'Flughafen Preveza/Aktion in ca. 15 Minuten' },
      { icon: '🚗', text: 'Eigener Parkplatz direkt beim Haus' },
    ],
    map: {
      title: 'Google Maps – Lage des Ferienhauses in Preveza',
      url:
        'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1569.8938249960415!2d20.730112688432815' +
        '!3d38.97826387733974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1' +
        '!2zMzjCsDU4JzQ0LjAiTiAyMMKwNDMnNDguNCJF!5e1!3m2!1sde!2sch!4v1789820303021!5m2!1sde!2sch',
    },
  },

  availability: {
    label: 'VERFÜGBARKEIT',
    title: 'Ist Ihr Wunschtermin frei?',
    text:
      'Wählen Sie die Wohnung und klicken Sie Anreise- und Abreisetag an. Der Kalender zeigt ' +
      'sofort, ob der Zeitraum noch frei ist – und übernimmt ihn direkt in Ihre Anfrage.',
    note:
      'Der Kalender zeigt den aktuellen Stand, ist aber keine verbindliche Buchung. ' +
      'Verbindlich wird ein Aufenthalt erst mit unserer Bestätigung per E-Mail.',
    button: 'Zeitraum anfragen',
  },

  contactCta: {
    image: { src: 'img/wohnen_balkon_1.webp', alt: 'Terrasse' },
    label: 'INTERESSIERT?',
    title: 'Jetzt Aufenthalt anfragen',
    text:
      'Überzeugen Sie sich selbst von diesem attraktiven Ferienhaus. Wir freuen uns auf ' +
      'Ihre Kontaktaufnahme und beraten Sie gerne persönlich.',
    button: 'Kontakt aufnehmen',
  },
};
