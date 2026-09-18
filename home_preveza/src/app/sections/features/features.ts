import { Component, input } from '@angular/core';
import { Feature } from '../../core/models';

@Component({
  selector: 'app-features',
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {
  readonly items = input.required<Feature[]>();
}
