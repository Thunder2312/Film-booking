import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShowtimesComponent } from './view-showtimes.component';

describe('ViewShowtimesComponent', () => {
  let component: ViewShowtimesComponent;
  let fixture: ComponentFixture<ViewShowtimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewShowtimesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewShowtimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
