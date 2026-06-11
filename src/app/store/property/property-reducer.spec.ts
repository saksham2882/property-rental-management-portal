import { TestBed } from '@angular/core/testing';

import { PropertyReducer } from './property-reducer';

describe('PropertyReducer', () => {
  let service: PropertyReducer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyReducer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
