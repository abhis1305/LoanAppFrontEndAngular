
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class LoanAccountService {

  http = inject(HttpClient);

  url = "https://localhost:7008/api/LoanAccount/GetAllLA";

  getLoanAccounts() 
  {
    return this.http.get<any>(this.url);
  }

  url2 = "https://localhost:7008/api/LoanAccount/GetLA";

  getLoanAccountById(id: number) 
  {
    return this.http.get<any>(`${this.url2}/${id}`);
  }

}
