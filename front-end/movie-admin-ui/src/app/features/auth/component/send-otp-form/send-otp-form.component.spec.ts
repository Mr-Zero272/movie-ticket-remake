import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendOtpFormComponent } from './send-otp-form.component';

describe('SendOtpFormComponent', () => {
  let component: SendOtpFormComponent;
  let fixture: ComponentFixture<SendOtpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendOtpFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendOtpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
