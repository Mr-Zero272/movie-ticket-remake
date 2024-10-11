import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { throwError } from 'rxjs';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { Hall } from '../../../shared/models/hall.model';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/seat/auditorium';

@Injectable({
  providedIn: 'root',
})
export class HallService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  fetchHalls({
    query = '',
    page = 1,
    size = 7,
    sort = 'none',
    sortOrder = 'asc',
  }: {
    query?: string;
    page?: number;
    size?: number;
    sort?: string;
    sortOrder?: 'desc' | 'asc';
  }) {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.httpClient.get<Pagination<Hall>>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        query,
        page,
        size,
        sort,
        sortOrder,
      },
    });
  }
}
