import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoScheduleComponent } from './do-schedule.component';

describe('DoScheduleComponent', () => {
  let component: DoScheduleComponent;
  let fixture: ComponentFixture<DoScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
