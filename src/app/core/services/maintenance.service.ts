import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaintenanceRequest } from '../models/maintenance-model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {

  private apiUrl = 'http://localhost:3000/maintenanceRequests';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl);
  }

  getByTenant(tenantId: any): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl).pipe(
      map(requests =>
        requests.filter(r => String(r.tenantId) === String(tenantId))
      )
    );
  }

  create(request: Partial<MaintenanceRequest>): Observable<MaintenanceRequest> {
    return this.http.post<MaintenanceRequest>(this.apiUrl, request);
  }

  updateStatus(id: number, status: string): Observable<MaintenanceRequest> {
    return this.http.patch<MaintenanceRequest>(
      `${this.apiUrl}/${id}`,
      { status }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}