import { Profile } from './profile';
import { authMock } from '../../../mock-data.spec';

describe('Profile', () => {
  it('creates profile component and checks unsaved changes', () => {
    const auth = authMock();
    const profile = new Profile(auth as any);
    expect(profile.hasUnsavedChanges()).toBeFalse();
  });
});
