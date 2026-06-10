import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalApplication } from './rental-application';

describe('RentalApplication', () => {
  let component: RentalApplication;
  let fixture: ComponentFixture<RentalApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalApplication],
    }).compileComponents();

    fixture = TestBed.createComponent(RentalApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
