import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Movie } from '../../../shared/models/movie.model';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { throwError } from 'rxjs';

const API = 'http://localhost:8272/api/v2/moon-movie/movie';

@Injectable({
    providedIn: 'root',
})
export class MovieService {
    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {}

    fetchMovies({
        q = '',
        page = 1,
        size = 7,
        originalLanguage = 'en',
        status = 'Released',
        genreId = 0,
        sort = 'title',
        sortOrder = 'asc',
    }: {
        q?: string;
        page?: number;
        size?: number;
        sort?: string;
        originalLanguage?: string;
        status?: string;
        genreId?: number;
        sortOrder?: 'desc' | 'asc';
    }) {
        const token = this.authService.getToken();
        if (!token) {
            return throwError(() => new Error('Token is missing'));
        }

        return this.http.get<Pagination<Movie>>(API, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                q,
                page,
                size,
                originalLanguage,
                status,
                genreId,
                sort,
                sortOrder,
            },
        });
    }
}
