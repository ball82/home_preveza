import { booleanAttribute, Component, input } from '@angular/core';

/** Kleines Label über einer Überschrift. `light` für die Variante auf dunklem Grund. */
@Component({
  selector: 'app-section-label',
  template: '<ng-content />',
  styleUrl: './section-label.scss',
  host: { '[class.light]': 'light()' },
})
export class SectionLabel {
  readonly light = input(false, { transform: booleanAttribute });
}
