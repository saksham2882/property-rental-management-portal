import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property, PropertyFilter } from '../models/property-model';

@Injectable({ providedIn: 'root' })
export class PropertyService {

  private apiUrl = 'http://localhost:3000/properties';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl);
  }

  getById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  getFiltered(filters: PropertyFilter): Observable<Property[]> {
    let params = new HttpParams();
    if (filters.city) params = params.set('city', filters.city);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.bedrooms) params = params.set('bedrooms', filters.bedrooms.toString());
    if (filters.furnishing) params = params.set('furnishing', filters.furnishing);
    if (filters.available !== undefined) params = params.set('available', String(filters.available));
    return this.http.get<Property[]>(this.apiUrl, { params });
  }

  create(property: Partial<Property>): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property);
  }

  update(id: number, data: Partial<Property>): Observable<Property> {
    return this.http.patch<Property>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
