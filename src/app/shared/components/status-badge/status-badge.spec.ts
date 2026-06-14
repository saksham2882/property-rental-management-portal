import { StatusBadgeComponent } from './status-badge';

describe('StatusBadgeComponent', () => {
  it('creates status badge and returns style class for status', () => {
    const badge = new StatusBadgeComponent();
    badge.status = 'under_review';
    expect(badge.statusClass).toBe('under_review');
  });
});
