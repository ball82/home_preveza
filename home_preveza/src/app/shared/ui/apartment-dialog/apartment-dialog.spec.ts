import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Apartment } from '../../../core/models';
import { APARTMENTS } from '../../../core/content/apartments-content';
import { ApartmentDialog } from './apartment-dialog';

/** Wohnung aus dem echten Inhalt holen, damit der Test die Daten mitprüft. */
function apartment(id: string): Apartment {
  return APARTMENTS.find((a) => a.id === id)!;
}

describe('ApartmentDialog', () => {
  let fixture: ComponentFixture<ApartmentDialog>;
  let el: HTMLElement;

  async function render(selected: Apartment | null) {
    fixture = TestBed.createComponent(ApartmentDialog);
    fixture.componentRef.setInput('apartment', selected);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
    return el;
  }

  async function click(selector: string) {
    el.querySelector<HTMLButtonElement>(selector)!.click();
    await fixture.whenStable();
  }

  /** Alt-Text des Bildes, das die Lightbox gerade zeigt. */
  function enlarged(): string | null {
    return el.querySelector<HTMLImageElement>('.lightbox__figure img')?.alt ?? null;
  }

  it('bleibt ohne Wohnung leer', async () => {
    await render(null);

    expect(el.querySelector('.dialog__panel')).toBeNull();
  });

  it('zeigt alle Bilder der gewählten Wohnung', async () => {
    const wohnung1 = apartment('wohnung-1');
    await render(wohnung1);

    expect(el.querySelector('h2')?.textContent).toContain(wohnung1.name);
    expect(el.querySelectorAll('.dialog__thumb').length).toBe(wohnung1.images.length);
    expect(el.querySelector('.dialog__pending')).toBeNull();
  });

  it('zeigt für Wohnung 3 den Hinweis statt einer leeren Galerie', async () => {
    const wohnung3 = apartment('wohnung-3');
    await render(wohnung3);

    expect(el.querySelector('.dialog__grid')).toBeNull();
    expect(el.querySelector('.dialog__pending')?.textContent).toContain(wohnung3.pendingNote!);
  });

  describe('Grossansicht', () => {
    const wohnung4 = apartment('wohnung-4');

    beforeEach(async () => {
      await render(wohnung4);
    });

    it('ist zu, solange kein Bild angeklickt wurde', () => {
      expect(el.querySelector('.lightbox__figure')).toBeNull();
    });

    it('zeigt das angeklickte Bild gross', async () => {
      await click('.dialog__thumb:nth-of-type(1)');

      expect(enlarged()).toBe(wohnung4.images[0].alt);
      expect(el.querySelector('.lightbox__counter')?.textContent).toBe(
        `1 / ${wohnung4.images.length}`,
      );
    });

    it('blättert mit den Pfeilen vor und zurück', async () => {
      el.querySelectorAll<HTMLButtonElement>('.dialog__thumb')[1].click();
      await fixture.whenStable();

      await click('.lightbox__nav--next');
      expect(enlarged()).toBe(wohnung4.images[2].alt);

      await click('.lightbox__nav--prev');
      expect(enlarged()).toBe(wohnung4.images[1].alt);
    });

    it('blättert am Ende wieder zum ersten Bild', async () => {
      const last = wohnung4.images.length - 1;
      el.querySelectorAll<HTMLButtonElement>('.dialog__thumb')[last].click();
      await fixture.whenStable();

      await click('.lightbox__nav--next');
      expect(enlarged()).toBe(wohnung4.images[0].alt);

      await click('.lightbox__nav--prev');
      expect(enlarged()).toBe(wohnung4.images[last].alt);
    });
  });
});
