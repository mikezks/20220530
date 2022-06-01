import { TestBed } from '@angular/core/testing';

import { RxConnectorService } from './rx-connector.service';

describe('RxConnectorService', () => {
  let service: RxConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
