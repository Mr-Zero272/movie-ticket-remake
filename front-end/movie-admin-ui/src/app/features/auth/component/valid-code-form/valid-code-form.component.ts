import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ChangePassService } from '../../services/change-pass.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { HeaderMobileComponent } from '../../../../shared/components/ui/header-mobile/header-mobile.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-valid-code-form',
  standalone: true,
  imports: [NgIf, ButtonComponent, ReactiveFormsModule, ErrorDisplayComponent, NgOtpInputModule, HeaderMobileComponent],
  templateUrl: './valid-code-form.component.html',
  styleUrl: './valid-code-form.component.scss',
})
export class ValidCodeFormComponent {
  @Input({ required: true }) email: string = '';

  @Output() onValidCode = new EventEmitter<void>();

  validCodeForm!: FormGroup;
  loading: boolean = false;
  reSendCodeLoading: boolean = false;
  isReSendCode: boolean = false;

  constructor(
    private changePasswordService: ChangePassService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.validCodeForm = new FormGroup({
      code: new FormControl<string>('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    });
  }

  getControl(name: string) {
    return this.validCodeForm.controls['code'] as FormControl<any>;
  }

  handleSubmit() {
    if (this.validCodeForm.status === 'INVALID') {
      return;
    }

    if (this.validCodeForm.value.code.length < 5) {
      return;
    }

    if (this.loading) return;
    this.loading = true;
    this.changePasswordService.validCode({ email: this.email, code: this.validCodeForm.value.code }).subscribe({
      next: (data) => {
        if (data.status === 200) {
          this.onValidCode.emit();
        }
        this.loading = false;
      },
      error: () => {
        this.toastService.showToast('danger', 'The code is incorrect. Please check again!', 4000);
        this.validCodeForm.controls['code'].reset();
        this.loading = false;
      },
    });
  }

  handleResendCode() {
    if (this.reSendCodeLoading) return;
    this.reSendCodeLoading = true;
    this.changePasswordService.sendOtpCodeChangePassword(this.email).subscribe({
      error: () => {
        this.toastService.showToast('danger', 'Some thing went wrong! Try again later!');
      },
      complete: () => {
        this.isReSendCode = true;
        this.reSendCodeLoading = false;
      },
    });
  }
}
