import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserStatistical } from '../models/users-statistical.model';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly authUrl = 'http://localhost:8272/api/v2/moon-movie/auth';
  private token: string = '';
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    this.token = this.authService.getToken();
  }

  checkToken() {
    if (!this.token) {
      throw new Error('Token does not exists!');
    }
  }

  fetchUserStatistical(year: number) {
    this.checkToken();

    return this.httpClient.get<Array<UserStatistical>>(`${this.authUrl}/users/statistical`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        year,
      },
    });
  }

  fetchUserInfo(userId: string) {
    this.checkToken();

    return this.httpClient.get<User>(`${this.authUrl}/user/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
