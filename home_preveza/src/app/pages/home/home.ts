import { Component, signal } from '@angular/core';
import { Apartment } from '../../core/models';
import { HOME } from '../../core/content/home-content';
import { SITE } from '../../core/content/site-content';
import { ContactCta } from '../../sections/contact-cta/contact-cta';
import { Features } from '../../sections/features/features';
import { Gallery } from '../../sections/gallery/gallery';
import { Hero } from '../../sections/hero/hero';
import { Location } from '../../sections/location/location';
import { ApartmentDialog } from '../../shared/ui/apartment-dialog/apartment-dialog';

/** Startseite: hält die Inhalte und setzt daraus die Sections zusammen. */
@Component({
  selector: 'app-home',
  imports: [Hero, Features, Gallery, Location, ContactCta, ApartmentDialog],
  templateUrl: './home.html',
})
export class Home {
  protected readonly home = HOME;
  protected readonly site = SITE;

  /** Wohnung im Galerie-Dialog – `null` heisst: Dialog zu. */
  protected readonly selected = signal<Apartment | null>(null);

  /** Klick auf eine Karte in der Galerie. */
  protected select(apartment: Apartment): void {
    this.selected.set(apartment);
  }

  /** Klick auf einen Hotspot im Hero – dort ist nur die Id bekannt. */
  protected selectById(id: string): void {
    this.selected.set(this.home.gallery.apartments.find((a) => a.id === id) ?? null);
  }
}
