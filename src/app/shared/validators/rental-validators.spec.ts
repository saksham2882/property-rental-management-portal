import { FormControl } from '@angular/forms';
import {
  incomeVsRentValidator,
  moveInDateValidator,
  occupancyLimitValidator,
  phoneValidator,
  requiredDocumentsValidator
} from './rental-validators';

describe('rental validators', () => {
  it('validates rental form fields', () => {
    const future = new Date();
    future.setDate(future.getDate() + 8);

    expect(phoneValidator()(new FormControl('9876543210'))).toBeNull();
    expect(requiredDocumentsValidator()(new FormControl(['ID Proof']))).toBeNull();
    expect(occupancyLimitValidator(2)(new FormControl(3))).toEqual(jasmine.objectContaining({ occupancyExceeded: jasmine.any(String) }));
    expect(incomeVsRentValidator(10000)(new FormControl(1000))).toEqual(jasmine.objectContaining({ incomeTooLow: jasmine.any(String) }));
    expect(moveInDateValidator()(new FormControl(future.toISOString().split('T')[0]))).toBeNull();
  });
});
