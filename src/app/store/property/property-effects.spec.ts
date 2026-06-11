import { TestBed } from '@angular/core/testing';

import { PropertyEffects } from './property-effects';

describe('PropertyEffects', () => {
  let service: PropertyEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
