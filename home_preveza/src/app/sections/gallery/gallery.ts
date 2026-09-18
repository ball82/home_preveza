import { Component, input, output } from '@angular/core';
import { Apartment } from '../../core/models';
import { SectionLabel } from '../../shared/ui/section-label/section-label';

/**
 * Übersicht der vier Wohnungen. Jede Karte ist ein Button – geklickt wird die
 * Wohnung nach aussen gemeldet, damit die Seite dazu den Galerie-Dialog öffnen kann.
 */
@Component({
  selector: 'app-gallery',
  imports: [SectionLabel],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly apartments = input.required<Apartment[]>();

  readonly apartmentSelected = output<Apartment>();
}
