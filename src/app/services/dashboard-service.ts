
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'https://localhost:7008/api/Dashboard';

  // Customer dashboard
  getCards(customerId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/Cards/${customerId}`
    );
  }

  getProgress(customerId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/Progress/${customerId}`
    );
  }

  getActiveLoan(customerId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/ActiveLoan/${customerId}`
    );
  }

  getEmiSummary(customerId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/EmiSummary/${customerId}`
    );
  }

  getRecentPayments(customerId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/RecentPayments/${customerId}`
    );
  }

  getDocuments(customerId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/Documents/${customerId}`
    );
  }

  // Officer dashboard
  getOfficerDashboard(from: string, to: string) {
    let params = new HttpParams();

    if (from) {
      params = params.set('from', from);
    }

    if (to) {
      params = params.set('to', to);
    }

    return this.http.get<any>(
      `${this.baseUrl}/Officer`,
      { params }
    );
  }
}