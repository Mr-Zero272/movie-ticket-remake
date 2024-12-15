import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AddMovieRequest } from '../../../shared/models/add-movie-request.model';
import { Movie } from '../../../shared/models/movie.model';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { TicketsSoldStatistical } from '../../../shared/models/ticket-statistical';

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

  maxDateValidator(maxDate: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const releaseDateControl = formGroup.get('releaseDate');

      if (!maxDate || !releaseDateControl) {
        return null;
      }

      if (releaseDateControl.errors && !releaseDateControl.errors['maxDate']) {
        return null;
      }

      const maxDateTime = new Date(maxDate).getTime();
      const rDateTime = new Date(releaseDateControl.value).getTime();

      if (rDateTime > maxDateTime) {
        releaseDateControl.setErrors({ maxDate: true });
        return { maxDate: true };
      } else {
        releaseDateControl.setErrors(null);
        return null;
      }
    };
  }

  deleteMovie(movieId: number) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http.delete<any>(API + `/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getTopHotMovies(sort: string, sortOrder: string, page: number, size: number) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.http.get<Pagination<TicketsSoldStatistical>>(
      'http://localhost:8272/api/v2/moon-movie/reservation/ticket/statistical',
      {
        params: {
          sort,
          sortOrder,
          page,
          size,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}
