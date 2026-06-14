import { confirmLeaveGuard } from './unsaved-changes-guard';

describe('confirmLeaveGuard', () => {
  it('confirms unsaved changes before deactivation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const component = { hasUnsavedChanges: () => true };
    expect(confirmLeaveGuard(component, {} as any, {} as any, {} as any)).toBeTrue();
    expect(window.confirm).toHaveBeenCalled();
  });
});
