import { of } from 'rxjs';
import { PropertyManagementComponent } from './property-management';
import { mockProperty } from '../../../mock-data.spec';

describe('PropertyManagementComponent', () => {
  it('creates property management component and initializes properties list', () => {
    const propertyService = { getAll: () => of([mockProperty]), update: () => of(mockProperty), create: () => of(mockProperty), delete: () => of(void 0), getById: () => of(mockProperty) };

    const propertyManagement = new PropertyManagementComponent(propertyService as any);
    propertyManagement.ngOnInit();
    expect(propertyManagement.properties()).toEqual([mockProperty]);
  });
});
