import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { BehaviorSubject, Observable, take, tap, throwError } from 'rxjs';
import { Pagination } from '../../../shared/models/pagination-obj.model';
import { Hall } from '../../../shared/models/hall.model';
import { Seat } from '../../../shared/models/seat';

@Injectable({
  providedIn: 'root',
})
export class HallService {
  private hallUrl: string = 'http://localhost:8272/api/v2/moon-movie/seat/auditorium';
  private hallSubject = new BehaviorSubject<Pagination<Hall>>(new Pagination([], 1, 20, 1, 1));
  hall$: Observable<Pagination<Hall>> = this.hallSubject.asObservable();
  private token: string = '';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    this.token = this.authService.getToken();
  }

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
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.httpClient
      .get<Pagination<Hall>>(this.hallUrl, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          query,
          page,
          size,
          sort,
          sortOrder,
        },
      })
      .pipe(
        tap((hallData) => {
          this.hallSubject.next(hallData);
        }),
      );
  }

  getHallData(): Observable<Pagination<Hall>> {
    return this.hall$;
  }

  getHallName(hallId: string) {
    const halls = this.hallSubject.getValue().data;
    if (halls.length === 0) {
      return 'unknown';
    }

    for (let i = 0; i < halls.length; i++) {
      if (halls[i].id === hallId) {
        return halls[i].name;
      }
    }

    return 'unknown';
  }

  updateHallLocally(hall: Hall) {
    const currentHallData = this.hallSubject.getValue();
    const updatedHallData = {
      ...currentHallData,
      data: currentHallData.data.map((h) => (h.id === hall.id ? hall : h)),
    };
    this.hallSubject.next(updatedHallData);
  }

  updateHallInfo(hall: Hall) {
    const currentHallData = this.hallSubject.getValue();
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }

    return this.httpClient
      .put<Hall>(`${this.hallUrl}/${hall.id}`, hall, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        tap((hallUpdated) => {
          this.hallSubject.next({
            ...currentHallData,
            data: currentHallData.data.map((h) => (h.id === hall.id ? hallUpdated : h)),
          });
        }),
      );
  }

  getHallById(hallId: string) {
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }
    return this.httpClient.get<Hall>(`${this.hallUrl}/${hallId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getSeatByHallId(hallId: string) {
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }
    return this.httpClient.get<Array<Seat>>(`http://localhost:8272/api/v2/moon-movie/seat/aud/${hallId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  updateSeatInfo(seatId: string, seatStatus: string) {
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }
    return this.httpClient.put<Seat>(
      `http://localhost:8272/api/v2/moon-movie/seat/s/${seatId}`,
      {
        status: seatStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }

  addNewHall(hallName: string, hallAddress: string) {
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }
    const currentData = this.hallSubject.getValue();
    return this.httpClient
      .post<Hall>(
        `http://localhost:8272/api/v2/moon-movie/seat/auditorium`,
        {
          name: hallName,
          address: hallAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      )
      .pipe(
        tap((hallAdded) => {
          this.hallSubject.next({
            ...currentData,
            totalElements: currentData.totalElements + 1,
            data: [hallAdded, ...currentData.data],
          });
        }),
      );
  }

  deleteHall(hallId: string) {
    const currentData = this.hallSubject.getValue();
    if (!this.token) {
      return throwError(() => new Error('Token is missing'));
    }
    return this.httpClient
      .delete<Hall>(`http://localhost:8272/api/v2/moon-movie/seat/auditorium/${hallId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        tap((deletedHall) => {
          this.hallSubject.next({
            ...currentData,
            totalElements: currentData.totalElements - 1,
            data: currentData.data.filter((g) => g.id !== deletedHall.id),
          });
        }),
      );
  }
}
