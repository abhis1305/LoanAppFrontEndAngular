
import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class LoanDeal
 {
    http = inject(HttpClient);


  url2 = "http://localhost:5235/api/Loan/apply";

  applyLoans(data: any) {
    return this.http.post<any>(this.url2, data);
  }

  url3 = "http://localhost:5235/api/Loan/calculate";

  Calculate(customerId: number, loanAmount: number, tenureYears: number) {
    return this.http.get<any>(this.url3, {
      params: {
        customerId,
        loanAmount,
        tenureYears
      }
    });
  }

// pending loan services

url = "http://localhost:5235/api/Loan/pending";

  getPendingLoans() {
    return this.http.get<any>(this.url);
  }

  url5 = "http://localhost:5235/api/Loan";

  GetLoanById(id: number) {
    return this.http.get<any>(`${this.url5}/${id}`);
  }

  ApproveLoan(id: number, data: any) {
    return this.http.put<any>(`${this.url5}/${id}/approve`, data);
  }

  RejectLoan(id: number, data: any) {
    return this.http.put<any>(`${this.url5}/${id}/reject`, data);
  }

}
