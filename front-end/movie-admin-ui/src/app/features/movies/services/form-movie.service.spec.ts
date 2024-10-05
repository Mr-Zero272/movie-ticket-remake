import { TestBed } from '@angular/core/testing';

import { FormMovieService } from './form-movie.service';

describe('FormMovieService', () => {
  let service: FormMovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormMovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
