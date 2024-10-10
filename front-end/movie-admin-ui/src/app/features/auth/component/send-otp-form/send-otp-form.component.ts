import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { ChangePassService } from '../../services/change-pass.service';
import { ToastService } from '../../../../core/services/toast.service';
import { HeaderMobileComponent } from '../../../../shared/components/ui/header-mobile/header-mobile.component';

@Component({
  selector: 'app-send-otp-form',
  standalone: true,
  imports: [ErrorDisplayComponent, ButtonComponent, ReactiveFormsModule, HeaderMobileComponent],
  templateUrl: './send-otp-form.component.html',
  styleUrl: './send-otp-form.component.scss',
})
export class SendOtpFormComponent implements OnInit {
  sendOtpCodeForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private changePasswordService: ChangePassService,
    private toastService: ToastService,
  ) {}

  @Output() onSendOtpCodeChangePassword = new EventEmitter<string>();

  ngOnInit(): void {
    this.sendOtpCodeForm = new FormGroup({
      email: new FormControl<string>('', Validators.required),
    });
  }

  handleSubmit() {
    if (this.sendOtpCodeForm.status === 'INVALID') {
      return;
    }

    if (this.loading) return;
    this.loading = true;
    this.changePasswordService.sendOtpCodeChangePassword(this.sendOtpCodeForm.value.email).subscribe({
      next: (data) => {
        if (data.status === 200) {
          this.onSendOtpCodeChangePassword.emit(this.sendOtpCodeForm.value.email);
          this.loading = false;
        }
      },
      error: () => {
        this.toastService.showToast('danger', 'Some thing went wrong! Try again later!');
      },
    });
  }
}
