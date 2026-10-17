import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmiScheduleService {

  private http = inject(HttpClient);

  private getHeaders() {
    const token = sessionStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // url = "http://localhost:7008/api/EmiSchedule/MyLoanAccounts";

  getLoanAccounts(): Observable<any>
  {
    return this.http.get<any>(this.url, { headers: this.getHeaders() });
  }

  url2 = "http://localhost:7008/api/EmiSchedule/GetEMI";

  getEmiSchedules(id: any): Observable<any>
  {
    return this.http.get<any>(`${this.url2}/${id}`, { headers: this.getHeaders() });
  }

}
