
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanAccountService {

  private http = inject(HttpClient);

  // API endpoint to get all loan accounts
  private readonly url =
    'http://localhost:7008/api/LoanAccount/GetAllLA';

  // API endpoint to get a loan account by ID
  private readonly url2 =
    'http://localhost:7008/api/LoanAccount/GetLA';

  // Get all loan accounts
  getLoanAccounts(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  // Get loan account details by ID
  getLoanAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url2}/${id}`);
  }
}
