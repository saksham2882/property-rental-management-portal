import { PropertyCardComponent } from './property-card';
import { mockProperty } from '../../../mock-data.spec';

describe('PropertyCardComponent', () => {
  it('creates property card and binds property inputs', () => {
    const card = new PropertyCardComponent();
    card.property = mockProperty;
    expect(card.property.title).toBe(mockProperty.title);
  });
});
