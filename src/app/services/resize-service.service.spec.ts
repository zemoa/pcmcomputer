import { TestBed } from '@angular/core/testing';

import { ResizeServiceService } from './resize-service.service';

describe('ResizeServiceService', () => {
  let service: ResizeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResizeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
