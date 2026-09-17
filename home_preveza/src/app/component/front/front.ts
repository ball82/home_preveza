import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-front',
  styleUrl: './front.scss',
  templateUrl: './front.html',
})
export class Front {
  readonly gallery = [
    { src: 'img/wohnen_1.jpg', alt: 'Wohnzimmer' },
    { src: 'img/kueche_1.jpeg', alt: 'Küche' },
    { src: 'img/essen_1.jpg', alt: 'Essbereich' },
    { src: 'img/schlafen_goss_1.jpg', alt: 'Schlafzimmer' },
    { src: 'img/bad_1.jpg', alt: 'Bad' },
    { src: 'img/aussen_1.jpeg', alt: 'Aussenansicht' },
  ];
}
