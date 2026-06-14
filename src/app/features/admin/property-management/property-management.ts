import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../../core/services/property-service';
import { Property } from '../../../core/models/property-model';
import { RentFormatPipe } from '../../../shared/pipes/rent-format.pipe';

@Component({
  selector: 'app-property-management',
  imports: [CommonModule, FormsModule, RentFormatPipe],
  templateUrl: './property-management.html',
  styleUrl: './property-management.css'
})

export class PropertyManagementComponent implements OnInit {

  properties = signal<Property[]>([]);
  loading = signal(true);
  showAddForm = signal(false);
  showEditForm = signal(false);
  editingPropertyId = signal<any>(null);
  successMsg = signal('');

  newProperty: Partial<Property> = {
    title: '', city: '', locality: '', type: 'Apartment',
    bedrooms: 2, bathrooms: 1, rent: 0, deposit: 0,
    furnishing: 'Semi-Furnished', available: true,
    area: 0, description: '', amenities: [], images: [],
    availableFrom: '', ownerId: 1,
    postedAt: new Date().toISOString().split('T')[0]
  };

  editPropertyData: Partial<Property> = {};

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getAll().subscribe(props => {
      this.properties.set(props);
      this.loading.set(false);
    });
  }

  toggleAvailability(prop: Property) {
    this.propertyService.update(prop.id, { available: !prop.available }).subscribe(() => {
      this.loadProperties();
      this.successMsg.set(`Property "${prop.title}" availability updated.`);
      setTimeout(() => this.successMsg.set(''), 3000);
    });
  }

  addProperty() {
    this.propertyService.create(this.newProperty).subscribe(() => {
      this.loadProperties();
      this.showAddForm.set(false);
      this.successMsg.set('New property added successfully!');
      setTimeout(() => this.successMsg.set(''), 3000);
      this.resetForm();
    });
  }

  startEdit(prop: Property) {
    this.editingPropertyId.set(prop.id);
    this.editPropertyData = { ...prop };
    this.showEditForm.set(true);
    this.showAddForm.set(false);
  }

  saveEdit() {
    if (!this.editingPropertyId()) return;
    this.propertyService.update(this.editingPropertyId()!, this.editPropertyData).subscribe(() => {
      this.loadProperties();
      this.showEditForm.set(false);
      this.editingPropertyId.set(null);
      this.successMsg.set('Property updated successfully!');
      setTimeout(() => this.successMsg.set(''), 3000);
    });
  }

  cancelEdit() {
    this.showEditForm.set(false);
    this.editingPropertyId.set(null);
    this.editPropertyData = {};
  }

  deleteProperty(id: number) {
    if (!confirm('Are you sure you want to delete this property?')) return;
    this.propertyService.delete(id).subscribe(() => {
      this.properties.set(this.properties().filter(p => p.id !== id));
      this.successMsg.set('Property deleted.');
      setTimeout(() => this.successMsg.set(''), 3000);
    });
  }

  resetForm() {
    this.newProperty = {
      title: '', city: '', locality: '', type: 'Apartment',
      bedrooms: 2, bathrooms: 1, rent: 0, deposit: 0,
      furnishing: 'Semi-Furnished', available: true,
      area: 0, description: '', amenities: [], images: [],
      availableFrom: '', ownerId: 1,
      postedAt: new Date().toISOString().split('T')[0]
    };
  }
}
