import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieScheduleVerticalCardComponent } from './movie-schedule-vertical-card.component';

describe('MovieScheduleVerticalCardComponent', () => {
  let component: MovieScheduleVerticalCardComponent;
  let fixture: ComponentFixture<MovieScheduleVerticalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieScheduleVerticalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieScheduleVerticalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
