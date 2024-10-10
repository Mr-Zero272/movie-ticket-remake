import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangePassService } from '../../services/change-pass.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { NgIf } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEye, heroEyeSlash } from '@ng-icons/heroicons/outline';
import { Router } from '@angular/router';
import { HeaderMobileComponent } from '../../../../shared/components/ui/header-mobile/header-mobile.component';

@Component({
  selector: 'app-change-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorDisplayComponent, ButtonComponent, NgIf, NgIconComponent, HeaderMobileComponent],
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.scss',
  providers: [
    provideIcons({
      heroEye,
      heroEyeSlash,
    }),
  ],
})
export class ChangePasswordFormComponent {
  @Input({ required: true }) email: string = '';

  showPassword: boolean = false;
  changePasswordForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private changePasswordService: ChangePassService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup(
      {
        newPassword: new FormControl<string>('', [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
        ]),
        confirmPassword: new FormControl<string>('', [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
        ]),
      },
      this.changePasswordService.passwordMatch('newPassword', 'confirmPassword'),
    );
  }

  getControl(name: string) {
    return this.changePasswordForm.controls['code'] as FormControl<any>;
  }

  handleSubmit() {
    if (this.changePasswordForm.status === 'INVALID') {
      return;
    }
    if (this.loading) return;
    this.loading = true;
    this.changePasswordService
      .changePassword({ email: this.email, newPassword: this.changePasswordForm.value.newPassword })
      .subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.router.navigate(['/']);
          }
          this.loading = false;
        },
        error: () => {
          this.toastService.showToast('danger', 'Some thing went wrong! Try again later!');
          this.loading = false;
        },
      });
  }

  handleToggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
