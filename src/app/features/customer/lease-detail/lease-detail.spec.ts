import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseDetailComponent } from './lease-detail';

describe('LeaseDetailComponent', () => {
  let component: LeaseDetailComponent;
  let fixture: ComponentFixture<LeaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaseDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaseDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
