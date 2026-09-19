import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SectionLabel } from '../../shared/ui/section-label/section-label';

/**
 * Lage des Hauses mit eingebetteter Google-Map.
 *
 * Die Embed-URL kommt aus den Inhalten und wird als Resource-URL freigegeben –
 * ohne das blockt Angular den iframe-`src`.
 */
@Component({
  selector: 'app-location',
  imports: [SectionLabel],
  templateUrl: './location.html',
  styleUrl: './location.scss',
})
export class Location {
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly mapUrl = input.required<string>();
  readonly mapTitle = input.required<string>();
  readonly facts = input.required<{ icon: string; text: string }[]>();

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly safeMapUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.mapUrl()),
  );
}
