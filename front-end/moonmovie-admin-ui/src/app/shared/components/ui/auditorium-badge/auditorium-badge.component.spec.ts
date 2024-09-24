import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriumBadgeComponent } from './auditorium-badge.component';

describe('AuditoriumBadgeComponent', () => {
  let component: AuditoriumBadgeComponent;
  let fixture: ComponentFixture<AuditoriumBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriumBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriumBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
