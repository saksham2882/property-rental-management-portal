import { StatusLabelPipe } from './status-label.pipe';

describe('StatusLabelPipe', () => {
  it('formats status label display values', () => {
    expect(new StatusLabelPipe().transform('under_review')).toBe('Under Review');
  });
});
