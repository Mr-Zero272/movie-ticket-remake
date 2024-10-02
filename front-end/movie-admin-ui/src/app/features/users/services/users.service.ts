import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { User } from '../../../shared/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {}

    fetchUsers({
        page = 1,
        size = 7,
        usernameOrEmail = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
    }: {
        page?: number;
        size?: number;
        usernameOrEmail?: string;
        sortBy?: string;
        sortOrder?: string;
    }): Observable<Pagination<User>> {
        const token = this.authService.getToken();
        if (!token) {
            return throwError(() => new Error('Token is missing'));
        }

        return this.http.get<Pagination<User>>('http://localhost:8272/api/v2/moon-movie/auth/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page,
                size,
                usernameOrEmail,
                sortBy,
                sortOrder,
            },
        });
    }
}
