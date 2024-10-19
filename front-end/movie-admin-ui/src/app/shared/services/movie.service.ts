import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MovieStatistical } from '../models/movie-statistical.model';
import { AuthService } from '../../core/services/auth.service';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private token = '';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    this.token = this.authService.getToken();
  }

  fetchMovieStatistical(year: number) {
    return this.httpClient.get<Array<MovieStatistical>>(`${API_URL}/statistical`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        year,
      },
    });
  }

  fetchScheduleMovieStatistical(year: number) {
    return this.httpClient.get<Array<MovieStatistical>>(`${API_URL}/schedule/statistical`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        year,
      },
    });
  }
}
