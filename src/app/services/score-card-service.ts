import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service';

export interface ScoreCardCustomer {
  customerId: number;
  name: string;
  email: string;
  income: number;
}

export interface ScoreCardApiResponse {
  success: boolean;
  data: ScoreCardCustomer[];
}

@Injectable({
  providedIn: 'root',
})
export class ScoreCardService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly apiUrl = 'https://localhost:7008/api/ScoreCard/Customers';

  getCustomers(): Observable<ScoreCardApiResponse> {
    const token = this.authService.getAccessToken();

    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get<ScoreCardApiResponse>(this.apiUrl, { headers });
  }
}
