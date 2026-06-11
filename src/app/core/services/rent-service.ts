import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rent } from '../models/rent-model';

@Injectable({ providedIn: 'root' })
export class RentService {

  private apiUrl = 'http://localhost:3000/rents';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Rent[]> {
    return this.http.get<Rent[]>(this.apiUrl);
  }

  getByTenant(tenantId: any): Observable<Rent[]> {
    return this.http.get<Rent[]>(this.apiUrl).pipe(
      map(rents => rents.filter(r => String(r.tenantId) === String(tenantId)))
    );
  }

  getByLease(leaseId: any): Observable<Rent[]> {
    return this.http.get<Rent[]>(this.apiUrl).pipe(
      map(rents => rents.filter(r => String(r.leaseId) === String(leaseId)))
    );
  }

  markPaid(id: number): Observable<Rent> {
    const paidDate = new Date().toISOString().split('T')[0];
    return this.http.patch<Rent>(`${this.apiUrl}/${id}`, { status: 'paid', paidDate });
  }

  create(rent: Partial<Rent>): Observable<Rent> {
    return this.http.post<Rent>(this.apiUrl, rent);
  }
}
