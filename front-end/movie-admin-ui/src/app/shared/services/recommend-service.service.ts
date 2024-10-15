import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecommendServiceService {
  private readonly recommendUrl: string = 'http://localhost:8272/api/v2/moon-movie/recommend/keywords';
  private token: string = '';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    this.token = this.authService.getToken();
  }

  fetchRecommendKeywords(query: string) {
    if (!this.token) {
      throw new Error('Token does not exists!');
    }

    return this.httpClient.get<string[]>(this.recommendUrl, {
      params: {
        query,
      },
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  fetchHistoryKeywords() {
    if (!this.token) {
      throw new Error('Token does not exists!');
    }

    return this.httpClient.get<string[]>(this.recommendUrl + '/history', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
