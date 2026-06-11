import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyCardComponent } from '../../../shared/components/property-card/property-card';
import { loadProperties, setFilters, clearFilters } from '../../../store/property/property-actions';
import { selectFilteredProperties, selectLoading, selectFilters } from '../../../store/property/property-selectors';
import { PropertyFilter } from '../../../core/models/property-model';

@Component({
  selector: 'app-property-catalog',
  imports: [CommonModule, FormsModule, PropertyCardComponent],
  templateUrl: './property-catalog.html',
  styleUrl: './property-catalog.css'
})
export class PropertyCatalogComponent implements OnInit {

  private store = inject(Store);

  properties$ = this.store.select(selectFilteredProperties);
  loading$ = this.store.select(selectLoading);
  activeFilters$ = this.store.select(selectFilters);


  filters: PropertyFilter = {};
  searchCity = '';

  cities = ['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai'];
  types = ['Apartment', 'Studio', 'Villa', 'PG'];
  furnishings = ['Fully-Furnished', 'Semi-Furnished', 'Unfurnished'];

  constructor() {}

  ngOnInit() {
    this.store.dispatch(loadProperties());
  }

  applyFilters() {
    const f: PropertyFilter = {};
    if (this.filters.city && this.filters.city !== '') f.city = this.filters.city;
    if (this.filters.type && this.filters.type !== '') f.type = this.filters.type;
    
    if (this.filters.bedrooms !== undefined && this.filters.bedrooms !== null && String(this.filters.bedrooms) !== 'undefined' && String(this.filters.bedrooms) !== '') {
      f.bedrooms = Number(this.filters.bedrooms);
    }
    
    if (this.filters.furnishing && this.filters.furnishing !== '') f.furnishing = this.filters.furnishing;
    if (this.filters.minRent !== undefined && this.filters.minRent !== null && String(this.filters.minRent) !== '') f.minRent = Number(this.filters.minRent);
    if (this.filters.maxRent !== undefined && this.filters.maxRent !== null && String(this.filters.maxRent) !== '') f.maxRent = Number(this.filters.maxRent);
    
    this.store.dispatch(setFilters({ filters: f }));
  }

  resetFilters() {
    this.filters = {};
    this.store.dispatch(clearFilters());
  }
}
