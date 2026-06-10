import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../../core/models/property.model';
import { RentFormatPipe } from '../../pipes/rent-format.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterLink, RentFormatPipe, HighlightDirective],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.css'
})
export class PropertyCardComponent {
  @Input() property!: Property;
}
