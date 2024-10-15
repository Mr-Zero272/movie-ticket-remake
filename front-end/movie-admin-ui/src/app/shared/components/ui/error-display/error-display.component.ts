import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss',
})
export class ErrorDisplayComponent {
  @Input({ required: true }) control!: AbstractControl<any, any>;
  @Input({ required: true }) isFormSubmitted: boolean = false;
  @Input() class: string = '';

  private errorMessages = {
    required: 'This field is required',
    min: 'Minimum length is not met',
    max: 'Maximum length exceeded',
    // Add more error messages as needed
  };

  getErrorMessages(): string[] {
    if (!this.control || !this.control.errors) {
      return [];
    }

    return Object.keys(this.control.errors).map((errorKey) => {
      if (errorKey === 'min') {
        if (this.control.errors) {
          return 'Minimum value of this field is ' + this.control.errors[errorKey].min;
        }
      }
      return this.errorMessages[errorKey as keyof typeof this.errorMessages];
    });
  }
}
