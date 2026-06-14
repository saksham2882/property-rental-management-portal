import { of } from 'rxjs';
import { Navbar } from './navbar';
import { authMock } from '../../../mock-data.spec';

describe('Navbar', () => {
  it('creates navbar component and toggles mobile menu', () => {
    const navbar = new Navbar(authMock() as any, { getByUser: () => of([]) } as any);
    navbar.toggleMenu();
    expect(navbar.menuOpen).toBeTrue();
  });
});
