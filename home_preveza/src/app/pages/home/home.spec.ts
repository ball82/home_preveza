import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HOME } from '../../core/content/home-content';
import { Home } from './home';

describe('Home', () => {
  it('rendert alle Sections mit den Inhalten aus home-content', async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('h1')?.textContent).toContain(HOME.hero.title);
    expect(el.querySelectorAll('.hotspot').length).toBe(HOME.hero.hotspots.length);
    expect(el.querySelectorAll('.feature').length).toBe(HOME.features.length);
    expect(el.querySelectorAll('.apartment').length).toBe(HOME.gallery.apartments.length);
  });
});
