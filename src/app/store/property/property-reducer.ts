import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Property, PropertyFilter } from '../../core/models/property-model';
import {
  loadProperties,
  loadPropertiesSuccess,
  loadPropertiesFailure,
  setFilters,
  clearFilters,
  selectProperty,
  addProperty,
  updateProperty,
  deleteProperty
} from './property-actions';

export interface PropertyState extends EntityState<Property> {
  loading: boolean;
  error: string | null;
  filters: PropertyFilter;
  selectedId: number | null;
}

export const propertyAdapter = createEntityAdapter<Property>();

const initialState: PropertyState = propertyAdapter.getInitialState({
  loading: false,
  error: null,
  filters: {},
  selectedId: null
});

export const propertyReducer = createReducer(
  initialState,

  on(loadProperties, state => ({ ...state, loading: true, error: null })),

  on(loadPropertiesSuccess, (state, { properties }) =>
    propertyAdapter.setAll(properties, { ...state, loading: false })
  ),

  on(loadPropertiesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(setFilters, (state, { filters }) => ({ ...state, filters })),

  on(clearFilters, state => ({ ...state, filters: {} })),

  on(selectProperty, (state, { id }) => ({ ...state, selectedId: id })),

  on(addProperty, (state, { property }) => propertyAdapter.addOne(property, state)),

  on(updateProperty, (state, { property }) =>
    propertyAdapter.updateOne({ id: property.id, changes: property }, state)
  ),

  on(deleteProperty, (state, { id }) => propertyAdapter.removeOne(id, state))
);
