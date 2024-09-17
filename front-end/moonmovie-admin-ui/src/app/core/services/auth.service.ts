import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ResponseApiTemplate, ResponseAuthType } from '../../shared/models/auth.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
    ) {}

    login(loginInfo: { usernameOrEmail: string; password: string; keepLogin: boolean }): Observable<ResponseAuthType> {
        return this.http
            .post<ResponseAuthType>('http://localhost:8272/api/v2/moon-movie/auth/authenticate', { ...loginInfo })
            .pipe(
                tap((response) => {
                    if ('token' in response) {
                        if (loginInfo.keepLogin) {
                            this.cookieService.set(
                                'mmtk',
                                response.token,
                                3600 * 24 * 7,
                                '/',
                                'localhost',
                                false,
                                'Lax',
                            );
                            this.cookieService.set(
                                'mmrtk',
                                response.refreshToken,
                                3600 * 24 * 7,
                                '/',
                                'localhost',
                                false,
                                'Lax',
                            );
                        } else {
                            this.cookieService.set('mmtk', response.token, undefined, '/', 'localhost', false, 'Lax');
                            this.cookieService.set(
                                'mmrtk',
                                response.refreshToken,
                                undefined,
                                '/',
                                'localhost',
                                false,
                                'Lax',
                            );
                        }
                    }
                    // catchError(this.handleError)
                }),
            );
    }

    loginWithGoogle(loginInfo: {
        redirectUri: string;
        code: string;
        keepLogin: boolean;
    }): Observable<ResponseAuthType> {
        return this.http
            .post<ResponseAuthType>('http://localhost:8272/api/v2/moon-movie/auth/authenticate/google', {
                ...loginInfo,
            })
            .pipe(
                tap((response) => {
                    if ('token' in response) {
                        if (loginInfo.keepLogin) {
                            this.cookieService.set(
                                'mmtk',
                                response.token,
                                3600 * 24 * 7,
                                '/',
                                'localhost',
                                false,
                                'Lax',
                            );
                            this.cookieService.set(
                                'mmrtk',
                                response.refreshToken,
                                3600 * 24 * 7,
                                '/',
                                'localhost',
                                false,
                                'Lax',
                            );
                        } else {
                            this.cookieService.set('mmtk', response.token, undefined, '/', 'localhost', false, 'Lax');
                            this.cookieService.set(
                                'mmrtk',
                                response.refreshToken,
                                undefined,
                                '/',
                                'localhost',
                                false,
                                'Lax',
                            );
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
    }

    // Check if the user is authenticated (token exists)
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
