import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MovieStatistical } from '../models/movie-statistical.model';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private httpClient: HttpClient) {}

  fetchMovieStatistical(year: number) {
    return this.httpClient.get<Array<MovieStatistical>>(`${API_URL}/statistical`, {
      params: {
        year,
      },
    });
  }

  fetchScheduleMovieStatistical(year: number) {
    return this.httpClient.get<Array<MovieStatistical>>(`${API_URL}/schedule/statistical`, {
      params: {
        year,
      },
    });
  }
}
