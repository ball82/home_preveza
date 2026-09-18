import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hotspot } from '../../core/models';
import { SectionLabel } from '../../shared/ui/section-label/section-label';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, SectionLabel],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly image = input.required<{ src: string; alt: string }>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly ctaLabel = input.required<string>();
  readonly ctaFragment = input.required<string>();
  readonly hotspots = input<Hotspot[]>([]);
}
