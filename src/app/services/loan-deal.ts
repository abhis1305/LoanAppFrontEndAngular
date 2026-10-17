import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoanDeal {
  private http = inject(HttpClient);

  // IMPORTANT:
  // Check the HTTPS port in the Loan API's launchSettings.json.
  // If the HTTPS port is 7235, keep this URL.
  private readonly baseUrl = 'https://localhost:7235/api/Loan';

  // APPLY LOAN
  applyLoans(data: any) {
    return this.http.post<any>(`${this.baseUrl}/apply`, data);
  }

  // CALCULATE LOAN
  Calculate(customerId: number, loanAmount: number, tenureYears: number) {
    return this.http.get<any>(`${this.baseUrl}/calculate`, {
      params: {
        customerId,
        loanAmount,
        tenureYears,
      },
    });
  }

  // GET PENDING LOANS
  getPendingLoans() {
    return this.http.get<any>(`${this.baseUrl}/pending`);
  }

  // GET LOAN BY ID
  GetLoanById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // APPROVE LOAN
  ApproveLoan(id: number, data: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}/approve`, data);
  }

  // REJECT LOAN
  RejectLoan(id: number, data: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}/reject`, data);
  }
}
