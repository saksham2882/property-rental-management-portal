import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, firstValueFrom, of } from 'rxjs';
import { PropertyEffects } from './property-effects';
import { PropertyService } from '../../core/services/property-service';
import { loadProperties, loadPropertiesSuccess } from './property-actions';
import { mockProperty } from '../../mock-data.spec';

describe('PropertyEffects', () => {
  it('loads properties through effects', async () => {
    const actions$ = new ReplaySubject(1);
    const service = { getAll: jasmine.createSpy('getAll').and.returnValue(of([mockProperty])) };

    TestBed.configureTestingModule({
      providers: [
        PropertyEffects,
        provideMockActions(() => actions$),
        { provide: PropertyService, useValue: service }
      ]
    });

    const effects = TestBed.inject(PropertyEffects);
    actions$.next(loadProperties());

    await expectAsync(firstValueFrom(effects.loadProperties$)).toBeResolvedTo(loadPropertiesSuccess({ properties: [mockProperty] }));
  });
});
