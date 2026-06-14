import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentTracking } from './rent-tracking';

describe('RentTracking', () => {
  let component: RentTracking;
  let fixture: ComponentFixture<RentTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentTracking],
    }).compileComponents();

    fixture = TestBed.createComponent(RentTracking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
