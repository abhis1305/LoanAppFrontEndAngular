
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Foreclosure {
  private apiUrl = 'http://localhost:7008/api/v1/user/ForeClosure';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      console.error('Access token not found. Please log in again.');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`
    });
  }

  getMyRequests() {
    return this.http.get(
      `${this.apiUrl}/MyRequests`,
      { headers: this.getHeaders() }
    );
  }

  createRequest(data: any) {
    return this.http.post(
      `${this.apiUrl}/Request`,
      data,
      { headers: this.getHeaders() }
    );
  }
}
