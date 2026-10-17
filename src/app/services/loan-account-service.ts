import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class LoanAccountService {

  http = inject(HttpClient);

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