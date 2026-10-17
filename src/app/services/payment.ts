
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentUrl = 'https://localhost:7008/api/v1/user/Payment';
  private emiUrl = 'https://localhost:7008/api/EmiSchedule';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getEmiById(emiScheduleId: number) {
    return this.http.get(
      `${this.emiUrl}/GetEMIById/${emiScheduleId}`,
      { headers: this.getHeaders() }
    );
  }

  getEmisByLoanAccount(loanAccountId: number) {
    return this.http.get(
      `${this.emiUrl}/GetEMI/${loanAccountId}`,
      { headers: this.getHeaders() }
    );
  }

  payEmi(emiScheduleId: number, paymentMode: string) {
    return this.http.post(
      `${this.paymentUrl}/PayEmi`,
      {
        emiScheduleId: emiScheduleId,
        paymentMode: paymentMode
      },
      { headers: this.getHeaders() }
    );
  }

  getMyPayments() {
    return this.http.get(
      `${this.paymentUrl}/MyPayments`,
      { headers: this.getHeaders() }
    );
  }
}
