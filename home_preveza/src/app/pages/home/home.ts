import { Component, signal } from '@angular/core';
import { Apartment } from '../../core/models';
import { HOME } from '../../core/content/home-content';
import { SITE } from '../../core/content/site-content';
import { ContactCta } from '../../sections/contact-cta/contact-cta';
import { Features } from '../../sections/features/features';
import { Gallery } from '../../sections/gallery/gallery';
import { Hero } from '../../sections/hero/hero';

/** Startseite: hält die Inhalte und setzt daraus die Sections zusammen. */
@Component({
  selector: 'app-home',
  imports: [Hero, Features, Gallery, ContactCta],
  templateUrl: './home.html',
})
export class Home {
  protected readonly home = HOME;
  protected readonly site = SITE;

  /**
   * Angeklickte Wohnung aus der Galerie.
   * TODO: Damit den Dialog mit der Wohnungs-Galerie öffnen
   * (`selected()!.images`); bis dahin bleibt die Auswahl nur gemerkt.
   */
  protected readonly selected = signal<Apartment | null>(null);

  protected select(apartment: Apartment): void {
    this.selected.set(apartment);
  }
}
