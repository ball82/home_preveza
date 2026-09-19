import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Apartment } from '../../../core/models';

/**
 * Modaler Dialog mit allen Bildern einer Wohnung, plus einer Lightbox für das
 * einzelne Bild.
 *
 * Der Dialog wird allein über `apartment` gesteuert: eine Wohnung öffnet ihn,
 * `null` schliesst ihn. Beide Ebenen sind native `<dialog>`, die sich im Top
 * Layer stapeln – dadurch bringen sie Backdrop, Fokusfalle und Escape schon
 * mit, und Escape schliesst immer nur die oberste Ebene.
 */
@Component({
  selector: 'app-apartment-dialog',
  templateUrl: './apartment-dialog.html',
  styleUrl: './apartment-dialog.scss',
})
export class ApartmentDialog {
  /** Angezeigte Wohnung – `null` hält den Dialog geschlossen. */
  readonly apartment = input.required<Apartment | null>();

  /** Meldet jedes Schliessen, auch das über Escape oder den Backdrop. */
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly lightbox = viewChild.required<ElementRef<HTMLDialogElement>>('lightbox');

  protected readonly images = computed(() => this.apartment()?.images ?? []);

  /** Index des vergrösserten Bildes – `null` heisst: Lightbox zu. */
  protected readonly lightboxIndex = signal<number | null>(null);

  protected readonly lightboxImage = computed(() => {
    const index = this.lightboxIndex();
    return index === null ? null : (this.images()[index] ?? null);
  });

  constructor() {
    // `afterRenderEffect` läuft nur im Browser – beim Prerendern gibt es kein
    // `showModal()`, und offen wäre der Dialog dort ohnehin nie.
    this.syncDialog(this.dialog, () => this.apartment() !== null);
    this.syncDialog(this.lightbox, () => this.lightboxImage() !== null);
  }

  /** Hält ein `<dialog>` im Takt mit dem Zustand, der es öffnen soll. */
  private syncDialog(
    ref: () => ElementRef<HTMLDialogElement>,
    shouldBeOpen: () => boolean,
  ): void {
    afterRenderEffect(() => {
      const element = ref().nativeElement;

      // Testumgebungen (jsdom) kennen `showModal` nicht – dort bleibt der
      // Dialog im DOM sichtbar, statt den Test mit einem Fehler abzubrechen.
      if (typeof element.showModal !== 'function') return;

      if (shouldBeOpen()) {
        if (!element.open) element.showModal();
      } else if (element.open) {
        element.close();
      }
    });
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  /** Aufgeräumt wird beim Schliessen, damit die Lightbox nicht offen bleibt. */
  protected onClosed(): void {
    this.lightboxIndex.set(null);
    this.closed.emit();
  }

  /** Klicks neben dem Panel treffen das `<dialog>` selbst – das ist der Backdrop. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  protected openLightbox(index: number): void {
    this.lightboxIndex.set(index);
  }

  protected closeLightbox(): void {
    this.lightbox().nativeElement.close();
  }

  /** Ein Bild vor oder zurück, am Ende wieder von vorn. */
  protected step(delta: number): void {
    const count = this.images().length;
    const index = this.lightboxIndex();
    if (index === null || count === 0) return;

    this.lightboxIndex.set((index + delta + count) % count);
  }

  protected onLightboxBackdropClick(event: MouseEvent): void {
    if (event.target === this.lightbox().nativeElement) this.closeLightbox();
  }

  protected onLightboxKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.step(-1);
    else if (event.key === 'ArrowRight') this.step(1);
    else return;

    // Sonst scrollt der Browser zusätzlich die Bilderliste dahinter.
    event.preventDefault();
  }
}
