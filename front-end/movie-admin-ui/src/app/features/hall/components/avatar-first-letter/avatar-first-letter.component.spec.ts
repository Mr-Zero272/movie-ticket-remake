import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarFirstLetterComponent } from './avatar-first-letter.component';

describe('AvatarFirstLetterComponent', () => {
  let component: AvatarFirstLetterComponent;
  let fixture: ComponentFixture<AvatarFirstLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarFirstLetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarFirstLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
