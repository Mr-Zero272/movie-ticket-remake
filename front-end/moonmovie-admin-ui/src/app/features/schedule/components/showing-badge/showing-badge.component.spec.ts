import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowingBadgeComponent } from './showing-badge.component';

describe('ShowingBadgeComponent', () => {
  let component: ShowingBadgeComponent;
  let fixture: ComponentFixture<ShowingBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowingBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowingBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
