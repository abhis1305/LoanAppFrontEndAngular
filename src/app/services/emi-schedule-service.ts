
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmiScheduleService {

  http = inject(HttpClient);

  url = "https://localhost:7008/api/LoanAccount/GetAllLA";

  getLoanAccounts()
  {
    return this.http.get<any>(this.url);
  }

  url2 = "https://localhost:7008/api/EmiSchedule/GetEMI";

  getEmiSchedules(id: any)
  {
    return this.http.get<any>(`${this.url2}/${id}`);
  }

}
