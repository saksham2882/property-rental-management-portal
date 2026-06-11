import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PropertyState, propertyAdapter } from './property-reducer';
import { Property } from '../../core/models/property-model';

export const selectPropertyState = createFeatureSelector<PropertyState>('properties');

const { selectAll, selectEntities } = propertyAdapter.getSelectors();

export const selectAllProperties = createSelector(selectPropertyState, selectAll);

export const selectPropertyEntities = createSelector(selectPropertyState, selectEntities);

export const selectLoading = createSelector(
  selectPropertyState,
  state => state.loading
);

export const selectError = createSelector(
  selectPropertyState,
  state => state.error
);

export const selectFilters = createSelector(
  selectPropertyState,
  state => state.filters
);

export const selectSelectedId = createSelector(
  selectPropertyState,
  state => state.selectedId
);

export const selectSelectedProperty = createSelector(
  selectPropertyEntities,
  selectSelectedId,
  (entities, id) => (id ? entities[id] : null)
);

export const selectFilteredProperties = createSelector(
  selectAllProperties,
  selectFilters,
  (properties, filters) => {
    let result: Property[] = [...properties];

    if (filters.city && filters.city.trim() !== '') {
      result = result.filter(p => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters.type && filters.type.trim() !== '') {
      result = result.filter(p => p.type.toLowerCase() === filters.type!.toLowerCase());
    }
    if (filters.bedrooms !== undefined && filters.bedrooms !== null && String(filters.bedrooms) !== 'undefined' && String(filters.bedrooms) !== '') {
      const targetBeds = Number(filters.bedrooms);
      if (!isNaN(targetBeds)) {
        result = result.filter(p => Number(p.bedrooms) === targetBeds);
      }
    }
    if (filters.furnishing && filters.furnishing.trim() !== '') {
      result = result.filter(p => p.furnishing.toLowerCase() === filters.furnishing!.toLowerCase());
    }
    if (filters.minRent !== undefined && filters.minRent !== null && !isNaN(Number(filters.minRent))) {
      result = result.filter(p => Number(p.rent) >= Number(filters.minRent));
    }
    if (filters.maxRent !== undefined && filters.maxRent !== null && !isNaN(Number(filters.maxRent))) {
      result = result.filter(p => Number(p.rent) <= Number(filters.maxRent));
    }
    if (filters.available !== undefined && filters.available !== null) {
      const targetAvail = String(filters.available) === 'true';
      result = result.filter(p => p.available === targetAvail);
    }

    return result;
  }
);
