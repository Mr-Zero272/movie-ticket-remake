import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserStatistical } from '../models/users-statistical.model';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/auth/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  fetchUserStatistical(year: number) {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Token does not exists!');
    }

    return this.httpClient.get<Array<UserStatistical>>(`${API_URL}/users/statistical`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        year,
      },
    });
  }
}
