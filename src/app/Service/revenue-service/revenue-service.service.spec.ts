import { TestBed } from '@angular/core/testing';

import { RevenueServiceService } from './revenue-service.service';

describe('RevenueServiceService', () => {
  let service: RevenueServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevenueServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
