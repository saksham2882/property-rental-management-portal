import {
  addProperty,
  clearFilters,
  deleteProperty,
  loadProperties,
  loadPropertiesFailure,
  loadPropertiesSuccess,
  selectProperty,
  setFilters,
  updateProperty
} from './property-actions';
import { mockProperty } from '../../mock-data.spec';

describe('property actions', () => {
  it('creates actions', () => {
    expect(loadProperties().type).toBe('[Property] Load Properties');
    expect(loadPropertiesSuccess({ properties: [mockProperty] }).properties).toEqual([mockProperty]);
    expect(loadPropertiesFailure({ error: 'failed' }).error).toBe('failed');
    expect(setFilters({ filters: { city: 'Mumbai' } }).filters.city).toBe('Mumbai');
    expect(clearFilters().type).toBe('[Property] Clear Filters');
    expect(selectProperty({ id: mockProperty.id }).id).toBe(mockProperty.id);
    expect(addProperty({ property: mockProperty }).property).toEqual(mockProperty);
    expect(updateProperty({ property: mockProperty }).property).toEqual(mockProperty);
    expect(deleteProperty({ id: mockProperty.id }).id).toBe(mockProperty.id);
  });
});
