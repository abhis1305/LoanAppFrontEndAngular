import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class cibilapiService {

  private http = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:7008/api/Cibil';

  private getHeaders(): HttpHeaders {
    const token =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('accessToken')
        : null;

    return new HttpHeaders(
      token
        ? { Authorization: `Bearer ${token}` }
        : {}
    );
  }

  generateCibil(customerId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/GenerateScore`,
      { customerId },
      { headers: this.getHeaders() }
    );
  }

  getCibil(customerId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/GetScore/${customerId}`,
      { headers: this.getHeaders() }
    );
  }
}