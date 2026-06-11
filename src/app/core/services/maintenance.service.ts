import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaintenanceRequest } from '../models/maintenance.model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {

  private apiUrl = 'http://localhost:3000/maintenanceRequests';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl);
  }

  getByTenant(tenantId: any): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl).pipe(
      map(reqs => reqs.filter(r => String(r.tenantId) === String(tenantId)))
    );
  }

  submit(request: Partial<MaintenanceRequest>): Observable<MaintenanceRequest> {
    const payload = {
      ...request,
      status: 'pending',
      raisedAt: new Date().toISOString().split('T')[0],
      resolvedAt: null,
      adminNote: ''
    };
    return this.http.post<MaintenanceRequest>(this.apiUrl, payload);
  }

  update(id: number, data: Partial<MaintenanceRequest>): Observable<MaintenanceRequest> {
    return this.http.patch<MaintenanceRequest>(`${this.apiUrl}/${id}`, data);
  }
}
