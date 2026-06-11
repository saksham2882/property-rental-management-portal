import { TestBed } from '@angular/core/testing';

import { PropertyActions } from './property-actions';

describe('PropertyActions', () => {
  let service: PropertyActions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyActions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
