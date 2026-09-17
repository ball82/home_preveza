import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Room1 } from './room-1';

describe('Room1', () => {
  let component: Room1;
  let fixture: ComponentFixture<Room1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Room1],
    }).compileComponents();

    fixture = TestBed.createComponent(Room1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
