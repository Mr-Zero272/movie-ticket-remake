import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ErrorDetail } from '../../../../shared/models/auth.model';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
    ggSignInUrl: string = '';
    formErrors: ErrorDetail = {};
    showPassword: boolean = false;
    loading: boolean = false;
    signInForm!: FormGroup;
    constructor(
        // @Inject(environment) private env: typeof environment,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private toast: ToastService,
    ) {}

    ngOnInit() {
        this.ggSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${environment.GG_REDIRECT_URI}&response_type=code&client_id=${environment.GG_CLIENT_ID}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline`;
        this.signInForm = new FormGroup({
            usernameOrEmail: new FormControl('', Validators.required),
            password: new FormControl('', [
                Validators.required,
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
            ]),
            keepLogin: new FormControl(true),
        });

        this.route.queryParamMap.subscribe((params) => {
            const code = params.get('code');
            const error = params.get('error');
            if (error) {
                this.toast.showToast('danger', 'Login with google failed!');
            }
            if (code) {
                this.loading = true;
                this.authService
                    .loginWithGoogle({
                        redirectUri: environment.GG_REDIRECT_URI,
                        code: code,
                        keepLogin: this.signInForm.value.keepLogin as boolean,
                    })
                    .subscribe({
                        next: (res) => {
                            if ('token' in res) {
                                this.router.navigate(['/']);
                            }
                        },
                        error: (err: HttpErrorResponse) => {
                            this.formErrors = { usernameOrEmail: 'Cannot login with google!' };
                        },
                    }).closed;
            }
        });
    }

    handleSubmit() {
        if (this.signInForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService
            .login({
                usernameOrEmail: this.signInForm.value.usernameOrEmail as string,
                password: this.signInForm.value.password as string,
                keepLogin: this.signInForm.value.keepLogin as boolean,
            })
            .subscribe({
                next: (res) => {
                    if ('token' in res) {
                        this.router.navigate(['/']);
                    }
                    this.authService.checkAuthOnAppStart();
                },
                error: (err: HttpErrorResponse) => {
                    this.formErrors = { usernameOrEmail: err.error?.message };
                },
            }).closed;

        this.loading = false;
    }

    get usernameOrEmail() {
        return this.signInForm.get('usernameOrEmail');
    }

    get password() {
        return this.signInForm.get('password');
    }

    hasProp(o: ErrorDetail, propName: string) {
        return o.hasOwnProperty(propName);
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }
}
