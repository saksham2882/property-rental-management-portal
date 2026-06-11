import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PropertyService } from '../../core/services/property.service';
import {
  loadProperties,
  loadPropertiesSuccess,
  loadPropertiesFailure
} from './property-actions';24

@Injectable()
export class PropertyEffects {
  private actions$: Actions = inject(Actions);
  private propertyService = inject(PropertyService);

  loadProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProperties),
      switchMap(() =>
        this.propertyService.getAll().pipe(
          map(properties => loadPropertiesSuccess({ properties })),
          catchError(err => of(loadPropertiesFailure({ error: err.message })))
        )
      )
    )
  );
}

