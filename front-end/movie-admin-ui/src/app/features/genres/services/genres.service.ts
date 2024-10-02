import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { map, Observable, throwError } from 'rxjs';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { Genre } from '../../../shared/models/genre.model';
import { LabelAndValue } from '../../../shared/models/labelAndValue';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/movie/genre';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  fetchGenres({
    q = '',
    page = 1,
    size = 7,
    sort = 'name',
    sortOrder = 'asc',
  }: {
    q?: string;
    page?: number;
    size?: number;
    sort?: string;
    sortOrder?: 'desc' | 'asc';
  }) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http.get<Pagination<Genre>>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q,
        page,
        size,
        sort,
        sortOrder,
      },
    });
  }

  fetchGenresForSearching({
    q = '',
    page = 1,
    size = 30,
    sort = 'name',
    sortOrder = 'asc',
  }: {
    q?: string;
    page?: number;
    size?: number;
    sort?: string;
    sortOrder?: 'desc' | 'asc';
  }): Observable<{ key: string; value: number }[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http
      .get<Pagination<Genre>>(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q,
          page,
          size,
          sort,
          sortOrder,
        },
      })
      .pipe(
        map((genrePagination) => {
          return genrePagination.data.map((genre) => ({
            key: genre.name,
            value: genre.id,
          }));
        }),
      );
  }
}
