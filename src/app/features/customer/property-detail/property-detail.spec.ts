import { of } from 'rxjs';
import { PropertyDetailComponent } from './property-detail';
import { mockProperty, authMock } from '../../../mock-data.spec';

describe('PropertyDetailComponent', () => {
  it('creates property detail component and loads property info', () => {
    const propertyService = { getById: () => of(mockProperty) };
    const appService = { getByCustomer: () => of([]), submit: () => of({}) };
    const route = { snapshot: { paramMap: { get: () => String(mockProperty.id) } } };
    const auth = authMock();

    const detail = new PropertyDetailComponent(
      route as any,
      propertyService as any,
      appService as any,
      auth as any
    );
    detail.ngOnInit();
    detail.selectImage(0);
    expect(detail.property()).toEqual(mockProperty);
  });
});
