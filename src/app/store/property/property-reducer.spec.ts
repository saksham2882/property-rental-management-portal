import { propertyReducer } from './property-reducer';
import { loadPropertiesSuccess } from './property-actions';
import { mockProperty } from '../../mock-data.spec';

describe('property reducer', () => {
  it('reduces loaded properties', () => {
    const loaded = propertyReducer(undefined, loadPropertiesSuccess({ properties: [mockProperty] }));
    expect(loaded.loading).toBeFalse();
    expect(loaded.entities[mockProperty.id]).toEqual(mockProperty);
    expect(loaded.ids).toEqual([mockProperty.id]);
  });
});
