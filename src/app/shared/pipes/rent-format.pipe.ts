import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rentFormat', standalone: true })
export class RentFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return '';
    
    const formatted = value.toLocaleString('en-IN');
    return `₹${formatted}/month`;
  }
}
