
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class EmiScheduleService {

  http = inject(HttpClient);

  url = "https://localhost:44319/api/LoanAccount/GetAllLA";

  getLoanAccounts() 
  {
    return this.http.get<any>(this.url);
  }

  url2 = "https://localhost:44319/api/EmiSchedule/GetEMI";

  getEmiSchedules(id: any) 
  {
    return this.http.get<any>(`${this.url2}/${id}`);
  }

}
