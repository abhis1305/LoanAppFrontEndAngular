import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmiScheduleService {

  http = inject(HttpClient);

  // Adds the login token to the request
  private getHeaders() {
    const token = sessionStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  url = "https://localhost:7008/api/EmiSchedule/MyLoanAccounts";

  getLoanAccounts()
  {
    return this.http.get<any>(this.url, { headers: this.getHeaders() });
  }

  url2 = "https://localhost:7008/api/EmiSchedule/GetEMI";

  getEmiSchedules(id: any)
  {
    return this.http.get<any>(`${this.url2}/${id}`, { headers: this.getHeaders() });
  }

}