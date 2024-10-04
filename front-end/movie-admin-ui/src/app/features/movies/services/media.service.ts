import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/media';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  addMediaMaterial({ type, files }: { type: 'image' | 'video'; files: Array<File> }) {
    let prefixUrl = '';
    if (type === 'image') {
      prefixUrl = '/images';
    } else {
      prefixUrl = '/videos';
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.http.post<string[]>(API_URL + prefixUrl, formData);
  }
}
