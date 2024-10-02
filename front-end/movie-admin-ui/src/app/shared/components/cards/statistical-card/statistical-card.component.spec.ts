import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalCardComponent } from './statistical-card.component';

describe('StatisticalCardComponent', () => {
  let component: StatisticalCardComponent;
  let fixture: ComponentFixture<StatisticalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
