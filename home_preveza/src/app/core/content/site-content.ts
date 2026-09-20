import { NavLink } from '../models';

/** Inhalte, die auf *jeder* Seite vorkommen (Header, Footer). */
export const SITE = {
  brand: {
    logo: '🏡',
    title: 'HOME PREVEZA',
    subtitle: 'FERIENHAUS · GRIECHENLAND · MIT GARTEN UND TERRASSE',
  },
  nav: [
    { label: 'Galerie', fragment: 'galerie' },
    { label: 'Lage', fragment: 'lage' },
    { label: 'Verfügbarkeit', fragment: 'verfuegbarkeit' },
    { label: 'Kontakt', fragment: 'kontakt' },
  ] satisfies NavLink[],
  contact: {
    email: 'info@home-preveza.gr',
    location: 'Preveza, Griechenland',
  },
  copyright: '© 2026 Home Preveza. Alle Rechte vorbehalten.',
};
