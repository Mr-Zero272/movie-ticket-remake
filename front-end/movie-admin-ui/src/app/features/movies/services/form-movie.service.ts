import { Injectable } from '@angular/core';
import { stateExtraFiled } from '../../../shared/types/stateExtraFiled';

@Injectable({
  providedIn: 'root',
})
export class FormMovieService {
  constructor() {}

  handleErrorExtraFields(
    images: Array<{ file: File | null; url: string; type: 'vertical' | 'horizontal' | 'square'; needDelete?: boolean }>,
    trailer: { file: File; url: string } | null,
    genres: Array<{ key: string; value: string | number }>,
  ) {
    let stateExtraFiled: stateExtraFiled = {
      imagesErrors: [],
      trailerErrors: [],
      genresErrors: [],
      isFormValid: true,
    };

    if (trailer === null) {
      stateExtraFiled.trailerErrors.push('This filed is required.');
      stateExtraFiled.isFormValid = false;
    }
    // check genres errors
    if (genres === null || genres.length === 0) {
      stateExtraFiled.genresErrors.push('This field is required!');
      stateExtraFiled.isFormValid = false;
    }

    // check images errors
    if (images === null || images.length === 0) {
      stateExtraFiled.imagesErrors.push('This field is required!');
      stateExtraFiled.isFormValid = false;
    } else {
      if (images.filter((img) => img.type === 'horizontal').length < 2) {
        stateExtraFiled.imagesErrors.push('You need at least 2 horizontal images!!!!!');
        stateExtraFiled.isFormValid = false;
      }

      if (images.filter((img) => img.type === 'vertical').length < 2) {
        stateExtraFiled.imagesErrors.push('You need at least 2 vertical images!!!!!');
        stateExtraFiled.isFormValid = false;
      }
    }

    return stateExtraFiled;
  }

  getFileNameFromUrl(url: string) {
    return url.split('/').slice(-1)[0];
  }

  isVerticalImage(url: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const currentImage = new Image();
      currentImage.src = url;
      currentImage.onload = () => {
        if (currentImage.width >= currentImage.height) {
          resolve(false);
        } else {
          resolve(true);
        }
      };
      currentImage.onerror = reject;
    });
  }
}
