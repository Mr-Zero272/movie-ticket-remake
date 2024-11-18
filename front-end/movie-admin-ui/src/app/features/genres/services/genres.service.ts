import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { BehaviorSubject, map, Observable, take, tap, throwError } from 'rxjs';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { Genre } from '../../../shared/models/genre.model';
import { LabelAndValue } from '../../../shared/models/labelAndValue';
import { OrdersService } from '../../orders/services/orders.service';
@Injectable({
  providedIn: 'root',
})
export class GenresService {
  private genreUrl: string = 'http://localhost:8272/api/v2/moon-movie/movie/genre';
  private token: string = '';
  private genreSubject = new BehaviorSubject<Pagination<Genre>>(new Pagination([], 1, 7, 1, 1));
  private genre$ = this.genreSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.token = this.authService.getToken();
  }

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
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http
      .get<Pagination<Genre>>(this.genreUrl, {
        headers: {
          Authorization: `Bearer ${this.token}`,
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
        tap((genreData) => {
          this.genreSubject.next(genreData);
        }),
      );
  }

  getGenreData(): Observable<Pagination<Genre>> {
    return this.genre$;
  }

  updateGenre(genre: Genre) {
    const currentData = this.genreSubject.getValue();
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http
      .put<Genre>(`${this.genreUrl}/${genre.id}`, genre, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        tap((genreUpdated) => {
          this.genreSubject.next({
            ...currentData,
            data: currentData.data.map((g) => (g.id === genre.id ? genreUpdated : g)),
          });
        }),
      );
  }

  addGenre(genreName: string) {
    const currentData = this.genreSubject.getValue();
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }
    return this.http
      .post<Genre>(
        this.genreUrl,
        { name: genreName },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      )
      .pipe(
        tap((genreAdded) => {
          this.genreSubject.next({
            ...currentData,
            totalElements: currentData.totalElements + 1,
            data: [genreAdded, ...currentData.data],
          });
        }),
      );
  }

  deleteGenre(genreId: number) {
    const currentData = this.genreSubject.getValue();
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }
    return this.http
      .delete<Genre>(`${this.genreUrl}/${genreId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        tap((deletedGenre) => {
          this.genreSubject.next({
            ...currentData,
            totalElements: currentData.totalElements - 1,
            data: currentData.data.filter((g) => g.id !== deletedGenre.id),
          });
        }),
      );
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
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http
      .get<Pagination<Genre>>(this.genreUrl, {
        headers: {
          Authorization: `Bearer ${this.token}`,
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
