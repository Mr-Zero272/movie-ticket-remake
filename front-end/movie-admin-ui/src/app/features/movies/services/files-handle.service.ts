import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilesHandleService {
  constructor() {}

  getFileNameFromUrl(url: string) {
    return url.split('/').slice(-1)[0];
  }
}
