import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidCodeFormComponent } from './valid-code-form.component';

describe('ValidCodeFormComponent', () => {
  let component: ValidCodeFormComponent;
  let fixture: ComponentFixture<ValidCodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidCodeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should not valid when code's length is less than 5", () => {
    const codeControl = component.validCodeForm.get('code');
    codeControl?.setValue('1234');
    expect(codeControl?.valid).toBeFalsy();
    expect(codeControl?.errors?.['code']).toBeTruthy();
  });
});
