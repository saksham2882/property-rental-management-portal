import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { PropertyCatalogComponent } from './property-catalog';

describe('PropertyCatalogComponent', () => {
  it('creates property catalog and applies filters', () => {
    const catalogStore = {
      select: () => of([]),
      dispatch: jasmine.createSpy('dispatch')
    };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: catalogStore }
      ]
    });
    const catalog = TestBed.runInInjectionContext(() => new PropertyCatalogComponent());
    catalog.applyFilters();
    expect(catalog.cities.length).toBeGreaterThan(0);
  });
});
