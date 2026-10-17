import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanAccountService {

  private http = inject(HttpClient);

  private getHeaders() {
    const token = sessionStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  url = "https://localhost:7008/api/LoanAccount/GetAllLA";

  getLoanAccounts()
  {
    return this.http.get<any>(this.url, { headers: this.getHeaders() });
  }

  url2 = "https://localhost:7008/api/LoanAccount/GetLA";

  getLoanAccountById(id: number)
  {
    return this.http.get<any>(`${this.url2}/${id}`, { headers: this.getHeaders() });
  }

}
  // API endpoint to get all loan accounts
  private readonly url =
    'https://localhost:7008/api/LoanAccount/GetAllLA';

  // API endpoint to get a loan account by ID
  private readonly url2 =
    'https://localhost:7008/api/LoanAccount/GetLA';

  // Get all loan accounts
  getLoanAccounts(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  // Get loan account details by ID
  getLoanAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url2}/${id}`);
  }
}
