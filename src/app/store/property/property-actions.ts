import { createAction, props } from '@ngrx/store';
import { Property, PropertyFilter } from '../../core/models/property-model';

export const loadProperties = createAction('[Property] Load Properties');

export const loadPropertiesSuccess = createAction(
  '[Property] Load Properties Success',
  props<{ properties: Property[] }>()
);

export const loadPropertiesFailure = createAction(
  '[Property] Load Properties Failure',
  props<{ error: string }>()
);

export const setFilters = createAction(
  '[Property] Set Filters',
  props<{ filters: PropertyFilter }>()
);

export const clearFilters = createAction('[Property] Clear Filters');

export const selectProperty = createAction(
  '[Property] Select Property',
  props<{ id: number }>()
);

export const addProperty = createAction(
  '[Property] Add Property',
  props<{ property: Property }>()
);

export const updateProperty = createAction(
  '[Property] Update Property',
  props<{ property: Property }>()
);

export const deleteProperty = createAction(
  '[Property] Delete Property',
  props<{ id: number }>()
);
