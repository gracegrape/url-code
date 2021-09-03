import { TestBed } from '@angular/core/testing';

import { ApiShortenService } from './api-shorten.service';

describe('ApiShortenService', () => {
  let service: ApiShortenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiShortenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
