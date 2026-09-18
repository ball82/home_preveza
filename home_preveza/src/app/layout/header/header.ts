import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SITE } from '../../core/content/site-content';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly route = inject(ActivatedRoute);

  protected readonly site = SITE;

  /** Aktuelle Sprungmarke aus der URL – ohne Fragment gilt die Startseite als aktiv. */
  private readonly fragment = toSignal(this.route.fragment);

  protected isActive(fragment: string): boolean {
    return (this.fragment() ?? 'hero') === fragment;
  }
}
