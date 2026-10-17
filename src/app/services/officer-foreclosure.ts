import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OfficerForeclosureService {
  private apiUrl = 'https://localhost:7008/api/v1/admin/AdminForeClosure';

  constructor(private http: HttpClient) {}

  getAllRequests() {
    return this.http.get(`${this.apiUrl}/GetAllRequests`, {
      headers: this.getHeaders()
    });
  }

  getRequestById(requestId: number) {
    return this.http.get(`${this.apiUrl}/GetRequestById/${requestId}`, {
      headers: this.getHeaders()
    });
  }

  approveRequest(requestId: number) {
    return this.http.patch(`${this.apiUrl}/ApproveRequest/${requestId}`, {}, {
      headers: this.getHeaders()
    });
  }

  rejectRequest(requestId: number) {
    return this.http.patch(`${this.apiUrl}/RejectRequest/${requestId}`, {}, {
      headers: this.getHeaders()
    });
  }

  private getHeaders() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}