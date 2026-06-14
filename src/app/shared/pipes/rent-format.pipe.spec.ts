import { RentFormatPipe } from './rent-format.pipe';

describe('RentFormatPipe', () => {
  it('formats display values', () => {
    expect(new RentFormatPipe().transform(12000)).toContain('12,000/month');
  });
});
