import { TestBed } from '@angular/core/testing';

import { RecommendServiceService } from './recommend-service.service';

describe('RecommendServiceService', () => {
  let service: RecommendServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
