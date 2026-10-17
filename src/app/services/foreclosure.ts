import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Foreclosure {

  constructor(private http: HttpClient) {}

  url = 'https://localhost:7008/api/v1/user/ForeClosure';

  getMyRequests() {
    return this.http.get<any>(`${this.url}/MyRequests`);
  }

  createRequest(data: any) {
    return this.http.post<any>(`${this.url}/Request`, data);
  }
}