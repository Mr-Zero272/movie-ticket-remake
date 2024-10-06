import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AddMovieRequest } from '../../../shared/models/add-movie-request.model';
import { Movie } from '../../../shared/models/movie.model';
import { Pagination } from '../../../shared/models/pagination-obj.model';

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
    originalLanguage = '',
    status = '',
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

  addNewMovie(request: AddMovieRequest) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }
    return this.http.post<Movie>(API, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getMovie(movieId: number) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }
    return this.http.get<Movie>(API + '/' + movieId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  editMovieInfo(request: AddMovieRequest, movieId: number) {
    if (movieId === 0) {
      return of(new Movie());
    }
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }
    return this.http.put<Movie>(API + `/${movieId}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
