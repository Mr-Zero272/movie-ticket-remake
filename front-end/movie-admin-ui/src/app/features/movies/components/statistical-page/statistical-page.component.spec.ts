import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalPageComponent } from './statistical-page.component';

describe('StatisticalPageComponent', () => {
  let component: StatisticalPageComponent;
  let fixture: ComponentFixture<StatisticalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
