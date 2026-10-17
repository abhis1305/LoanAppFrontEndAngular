
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PenaltyService {
  private penaltyUrl = 'https://localhost:7008/api/v1/user/Penalty';
  private paymentUrl = 'https://localhost:7008/api/v1/user/Payment';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getMyPenalties() {
    return this.http.get(
      `${this.penaltyUrl}/GetMyPenalties`,
      { headers: this.getHeaders() }
    );
  }

  payPenalty(penaltyId: number) {
    return this.http.post(
      `${this.paymentUrl}/PayPenalty/${penaltyId}`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
