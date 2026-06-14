import { selectFilteredProperties, selectLoading } from './property-selectors';
import { PropertyState } from './property-reducer';
import { mockProperty } from '../../mock-data.spec';

describe('property selectors', () => {
  it('selects loading status and filters properties by city/rent', () => {
    const state: PropertyState = {
      ids: [mockProperty.id],
      entities: { [mockProperty.id]: mockProperty },
      loading: false,
      error: null,
      selectedId: null,
      filters: { city: 'mumbai', maxRent: 25000 }
    };

    expect(selectLoading.projector(state)).toBeFalse();
    expect(selectFilteredProperties.projector([mockProperty], state.filters)).toEqual([mockProperty]);
  });
});
