import { Footer } from './footer';
import { authMock } from '../../../mock-data.spec';

describe('Footer', () => {
  it('creates footer component and exposes current year', () => {
    expect(new Footer(authMock() as any).currentYear).toBeGreaterThan(2020);
  });
});
