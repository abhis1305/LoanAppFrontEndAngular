
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CibilCustomerProfile {
  customerId: number;
  customerName: string;
  panNumber: string | null;
}

export interface CibilProfileResponse {
  message: string;
  data: CibilCustomerProfile;
}

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

  // Get details of the currently logged-in customer
  getCustomerProfile(): Observable<CibilProfileResponse> {
    return this.http.get<CibilProfileResponse>(
      `${this.baseUrl}/Profile`,
      { headers: this.getHeaders() }
    );
  }

  // Generate CIBIL score
  generateCibil(customerId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/GenerateScore`,
      { customerId },
      { headers: this.getHeaders() }
    );
  }

  // Get existing CIBIL score
  getCibil(customerId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/GetScore/${customerId}`,
      { headers: this.getHeaders() }
    );
  }
}
