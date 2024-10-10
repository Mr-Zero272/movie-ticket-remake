import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/auth';

@Injectable({
  providedIn: 'root',
})
export class ChangePassService {
  constructor(private httpClient: HttpClient) {}

  sendOtpCodeChangePassword(email: string) {
    return this.httpClient.get<{ status: number; message: string }>(API_URL + '/change-pass', {
      params: {
        email,
      },
    });
  }

  validCode(validCodeInfo: { email: string; code: string }) {
    return this.httpClient.post<{ status: number; message: string }>(API_URL + '/valid-otp', validCodeInfo);
  }

  changePassword(changePasswordInfo: { email: string; newPassword: string }) {
    return this.httpClient.post<{ status: number; message: string }>(API_URL + '/change-pass', changePasswordInfo);
  }

  passwordMatch(newPassword: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = formGroup.get(newPassword);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}
