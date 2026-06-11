import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lease } from '../models/lease-model';

@Injectable({ providedIn: 'root' })
export class LeaseService {

  private apiUrl = 'http://localhost:3000/leases';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Lease[]> {
    return this.http.get<Lease[]>(this.apiUrl);
  }

  getByTenant(tenantId: any): Observable<Lease[]> {
    return this.http.get<Lease[]>(this.apiUrl).pipe(
      map(leases => leases.filter(l => String(l.tenantId) === String(tenantId)))
    );
  }

  getById(id: number): Observable<Lease> {
    return this.http.get<Lease>(`${this.apiUrl}/${id}`);
  }

  create(lease: Partial<Lease>): Observable<Lease> {
    return this.http.post<Lease>(this.apiUrl, lease);
  }

  update(id: number, data: Partial<Lease>): Observable<Lease> {
    return this.http.patch<Lease>(`${this.apiUrl}/${id}`, data);
  }
}
