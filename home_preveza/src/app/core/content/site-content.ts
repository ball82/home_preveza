import { NavLink } from '../models';

/** Inhalte, die auf *jeder* Seite vorkommen (Header, Footer). */
export const SITE = {
  brand: {
    logo: '🏡',
    title: 'HOME PREVEZA',
    subtitle: 'FERIENHAUS · GRIECHENLAND · MEERBLICK',
  },
  nav: [
    { label: 'Startseite', fragment: 'hero' },
    { label: 'Zimmer', fragment: 'zimmer' },
    { label: 'Lage', fragment: 'lage' },
    { label: 'Galerie', fragment: 'galerie' },
    { label: 'Kontakt', fragment: 'kontakt' },
  ] satisfies NavLink[],
  contact: {
    email: 'info@home-preveza.gr',
    location: 'Preveza, Griechenland',
  },
  copyright: '© 2026 Home Preveza. Alle Rechte vorbehalten.',
};
