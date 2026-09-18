import { Component, input } from '@angular/core';
import { SectionLabel } from '../../shared/ui/section-label/section-label';

@Component({
  selector: 'app-contact-cta',
  imports: [SectionLabel],
  templateUrl: './contact-cta.html',
  styleUrl: './contact-cta.scss',
})
export class ContactCta {
  readonly image = input.required<{ src: string; alt: string }>();
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly buttonLabel = input.required<string>();
  readonly email = input.required<string>();
}
