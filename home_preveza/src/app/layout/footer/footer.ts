import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/content/site-content';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly site = SITE;

  /** Im Footer ohne den Kontakt-Link – der steht eine Spalte weiter rechts. */
  protected readonly quickLinks = SITE.nav.filter((link) => link.fragment !== 'kontakt');
}
