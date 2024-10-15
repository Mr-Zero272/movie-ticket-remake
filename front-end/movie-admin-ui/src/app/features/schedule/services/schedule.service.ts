import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { Showing } from '../../../shared/models/showing.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private showingUrl: string = 'http://localhost:8272/api/v2/moon-movie/movie/showing';
  constructor(private httpClient: HttpClient) {}
  private showingInfo$ = new BehaviorSubject<Showing | null>(null);

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
}
