import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCatalog } from './property-catalog';

describe('PropertyCatalog', () => {
  let component: PropertyCatalog;
  let fixture: ComponentFixture<PropertyCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
