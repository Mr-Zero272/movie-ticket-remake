import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { Showing } from '../../../shared/models/showing.model';
import { BehaviorSubject, tap } from 'rxjs';
import { EditShowingRequest } from '../../../shared/models/edit-showing-request.model';
import { AuthService } from '../../../core/services/auth.service';

export interface ResponseSchedule {
  totalShowingsScheduled: number;
  monthSchedule: number;
  totalDatesScheduled: number;
  totalAuditoriums: number;
  maxScreeningPerDate: number;
}

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private showingUrl: string = 'http://localhost:8272/api/v2/moon-movie/movie/showing';
  private showingInfo$ = new BehaviorSubject<Showing | null>(null);
  private token = '';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    this.token = this.authService.getToken();
  }

  fetchShowings({
    query = '',
    date = new Date().toISOString().split('T')[0] + 'T00:00:00',
    auditoriumId = '',
    page = 1,
    size = 10,
  }: {
    query?: string;
    date?: string;
    auditoriumId?: string;
    page?: number;
    size?: number;
  }) {
    return this.httpClient.get<Pagination<Showing>>(this.showingUrl + '/schedule', {
      params: {
        query,
        auditoriumId,
        date,
        page,
        size,
      },
    });
  }

  fetchShowingInfo(showingId: number) {
    return this.httpClient.get<Showing>(`${this.showingUrl}/${showingId}`).pipe(
      tap((data) => {
        this.showingInfo$.next(data);
      }),
    );
  }

  getShowingInfo() {
    return this.showingInfo$.asObservable();
  }

  editShowingInfo(showingId: number, showingEdit: EditShowingRequest) {
    return this.httpClient.put<Showing>(`${this.showingUrl}/auditorium/${showingId}`, showingEdit, {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
    });
  }

  addShowing(showingInfo: { date: string; position: number; type: string; auditoriumId: string; movieId: number }) {
    return this.httpClient.post<Showing>(this.showingUrl, showingInfo, {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
    });
  }

  deleteShowing(showingId: number) {
    return this.httpClient.delete<void>(`${this.showingUrl}/${showingId}`, {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
    });
  }

  doSchedule(month: number, year: number) {
    return this.httpClient.post<ResponseSchedule>(
      'http://localhost:8272/api/v2/moon-movie/movie/schedule',
      {
        month,
        year,
      },
      {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      },
    );
  }

  getShowingStatistical(month: number = 8, year: number = 2024) {
    return this.httpClient.get<{ date: number; totalMovies: number }[]>(this.showingUrl + '/statistical', {
      params: {
        month,
        year,
      },
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
    });
  }
}
