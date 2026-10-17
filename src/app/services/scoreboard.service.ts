
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScorecardService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:7008/api/ScoreCard';

  // Get all customers for the Scorecard Index page.
  getAllCustomers() {
    return this.http.get<any>(`${this.baseUrl}/Customers`);
  }

  // Generate a scorecard for a selected customer.
  generateScorecard(customerId: number) {
    return this.http.post<any>(
      `${this.baseUrl}/Generate`,
      { customerId }
    );
  }

  // Retrieve an existing scorecard for a customer.
  getScorecardByCustomerId(customerId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/${customerId}`
    );
  }
}
