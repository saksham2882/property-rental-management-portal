import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RentalApplication } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  private apiUrl = 'http://localhost:3000/applications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RentalApplication[]> {
    return this.http.get<RentalApplication[]>(this.apiUrl);
  }

  getByCustomer(customerId: any): Observable<RentalApplication[]> {
    return this.http.get<RentalApplication[]>(this.apiUrl).pipe(
      map(apps => apps.filter(app => String(app.customerId) === String(customerId)))
    );
  }

  getByProperty(propertyId: any): Observable<RentalApplication[]> {
    return this.http.get<RentalApplication[]>(this.apiUrl).pipe(
      map(apps => apps.filter(app => String(app.propertyId) === String(propertyId)))
    );
  }

  submit(app: RentalApplication): Observable<RentalApplication> {
    const payload = {
      ...app,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'under_review'
    };
    return this.http.post<RentalApplication>(this.apiUrl, payload);
  }

  updateStatus(id: number, status: string): Observable<RentalApplication> {
    return this.http.patch<RentalApplication>(`${this.apiUrl}/${id}`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
