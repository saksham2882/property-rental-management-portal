import { TemplateRef, ViewContainerRef } from '@angular/core';
import { RoleAccessDirective } from './role-acess-directive';
import { authMock } from '../../mock-data.spec';

describe('RoleAccessDirective', () => {
  it('renders or clears role access templates', () => {
    const view = {
      createEmbeddedView: jasmine.createSpy('createEmbeddedView'),
      clear: jasmine.createSpy('clear')
    } as unknown as ViewContainerRef;
    const directive = new RoleAccessDirective({} as TemplateRef<unknown>, view, authMock() as any);
    directive.appRoleAccess = 'customer';
    directive.ngOnInit();
    expect(view.createEmbeddedView).toHaveBeenCalled();
  });
});
