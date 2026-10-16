import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Foreclosure {
  constructor(private http: HttpClient) {}

  getMyRequests() {
    return this.http.get('https://localhost:7008/api/v1/user/ForeClosure/MyRequests');
  }

  createRequest(data: any) {
    return this.http.post('https://localhost:7008/api/v1/user/ForeClosure/Request', data);
  }
}