import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { ResponseApiTemplate, ResponseAuthType, User } from '../../shared/models/auth.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private toast: ToastService,
  ) {}

  login(loginInfo: { usernameOrEmail: string; password: string; keepLogin: boolean }): Observable<ResponseAuthType> {
    return this.http
      .post<ResponseAuthType>('http://localhost:8272/api/v2/moon-movie/auth/authenticate', { ...loginInfo })
      .pipe(
        tap((response) => {
          if ('token' in response) {
            if (!this.isAdmin(response.token)) {
              this.toast.showToast('danger', 'Do not have permission!');
              return;
            }

            if (loginInfo.keepLogin) {
              this.cookieService.set('mmtk', response.token, 7, '/', 'localhost', false, 'Lax');
              this.cookieService.set('mmrtk', response.refreshToken, 9, '/', 'localhost', false, 'Lax');
            } else {
              this.cookieService.set('mmtk', response.token, undefined, '/', 'localhost', false, 'Lax');
              this.cookieService.set('mmrtk', response.refreshToken, undefined, '/', 'localhost', false, 'Lax');
            }
          }
          // catchError(this.handleError)
        }),
      );
  }

  loginWithGoogle(loginInfo: { redirectUri: string; code: string; keepLogin: boolean }): Observable<ResponseAuthType> {
    return this.http
      .post<ResponseAuthType>('http://localhost:8272/api/v2/moon-movie/auth/authenticate/google', {
        ...loginInfo,
      })
      .pipe(
        tap((response) => {
          if ('token' in response) {
            if (!this.isAdmin(response.token)) {
              this.toast.showToast('danger', 'Do not have permission!');
              return;
            }

            if (loginInfo.keepLogin) {
              this.cookieService.set('mmtk', response.token, 3600 * 24 * 7, '/', 'localhost', false, 'Lax');
              this.cookieService.set('mmrtk', response.refreshToken, 3600 * 24 * 7, '/', 'localhost', false, 'Lax');
            } else {
              this.cookieService.set('mmtk', response.token, undefined, '/', 'localhost', false, 'Lax');
              this.cookieService.set('mmrtk', response.refreshToken, undefined, '/', 'localhost', false, 'Lax');
            }
          }
          // catchError(this.handleError)
        }),
      );
  }

  getToken(): string {
    return this.cookieService.get('mmtk');
  }

  // Clear the token when logging out
  logout(): void {
    this.cookieService.delete('mmtk');
    this.cookieService.delete('mmrtk');
    this.user$.next(null);
    this.router.navigate(['/sign-in']);
  }

  // Check if the user is authenticated (token exists)
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  checkAuthOnAppStart() {
    this.loading$.next(true);
    const token = this.getToken(); // Get token from cookie
    if (token) {
      if (!this.isAdmin(token)) {
        this.router.navigate(['/sign-in']);
        this.logout();
      }

      // Call your API to get user info using the token
      this.http
        .get<any>('http://localhost:8272/api/v2/moon-movie/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          finalize(() => {
            this.loading$.next(false);
          }),
        )
        .subscribe({
          next: (userData: any) => {
            this.user$.next(userData); // Set the user information in the BehaviorSubject
          },
          error: (error) => {
            console.error('Error fetching user info', error);
            this.user$.next(null); // Clear user info on error
          },
        });
    }
  }

  updateUser(user: { username: string; email: string; name: string; bio: string; avatar: string }) {
    this.loading$.next(true);
    const token = this.getToken();
    if (token) {
      // Call your API to get user info using the token
      this.http
        .put<User>(
          'http://localhost:8272/api/v2/moon-movie/auth/user',
          { ...user },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .pipe(
          finalize(() => {
            this.loading$.next(false);
          }),
        )
        .subscribe({
          next: (userData: any) => {
            this.toast.showToast('success', 'Update user info successfully!');
            this.user$.next(userData); // Set the user information in the BehaviorSubject
          },
          error: (error) => {
            console.error('Error update user info', error);
            this.toast.showToast('danger', 'Cannot update user information!');
          },
        });
    }
  }

  getLoading() {
    return this.loading$.asObservable();
  }

  // To access the current user outside the service
  getUser() {
    return this.user$.asObservable(); // Return an observable for the current user
  }

  isAdmin(token: string) {
    const decodeToken = jwtDecode(token);
    if ('role' in decodeToken && decodeToken.role === 'ADMIN') {
      return true;
    }

    return false;
  }
}
