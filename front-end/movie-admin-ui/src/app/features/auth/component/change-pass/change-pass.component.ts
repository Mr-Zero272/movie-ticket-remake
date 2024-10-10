import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { SendOtpFormComponent } from '../send-otp-form/send-otp-form.component';
import { ValidCodeFormComponent } from '../valid-code-form/valid-code-form.component';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';

@Component({
  selector: 'app-change-pass',
  standalone: true,
  imports: [NgIf, SendOtpFormComponent, ValidCodeFormComponent, ChangePasswordFormComponent],
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.scss',
})
export class ChangePassComponent {
  step: 'sendOtpCode' | 'validCode' | 'changePassword' = 'sendOtpCode';
  currentEmail: string = '';

  handleSendOtpCodeChangePassword = (email: string) => {
    this.currentEmail = email;
    this.handleChangeForm();
  };

  handleChangeForm = () => {
    switch (this.step) {
      case 'sendOtpCode':
        this.step = 'validCode';
        break;
      case 'validCode':
        this.step = 'changePassword';
        break;
      default:
        this.step = 'sendOtpCode';
    }
  };
}
