import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/media';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  addMediaMaterial({ type, files }: { type: 'image' | 'video'; files: Array<File> }) {
    if (files.length === 0) {
      return of([]);
    }
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

  deleteMediaMaterial({ filenames, type }: { filenames: string[]; type: 'image' | 'video' }) {
    let prefixUrl = '';
    if (type === 'image') {
      prefixUrl = '/images';
    } else {
      prefixUrl = '/videos';
    }

    return this.http.delete<void>(API_URL + prefixUrl, {
      body: {
        filenames,
      },
    });
  }
}
