import { ElementRef } from '@angular/core';
import { HighlightDirective } from './highlight-directive';

describe('HighlightDirective', () => {
  it('applies highlight styles on mouse enter and clears on mouse leave', () => {
    const nativeElement = { style: { backgroundColor: '', transition: '' } };
    const directive = new HighlightDirective({ nativeElement } as ElementRef);
    directive.appHighlight = 'yellow';
    directive.onMouseEnter();
    expect(nativeElement.style.backgroundColor).toBe('yellow');
    directive.onMouseLeave();
    expect(nativeElement.style.backgroundColor).toBe('');
  });
});
