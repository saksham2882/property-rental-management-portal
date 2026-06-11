import { TestBed } from '@angular/core/testing';

import { PropertySelectors } from './property-selectors';

describe('PropertySelectors', () => {
  let service: PropertySelectors;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertySelectors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
