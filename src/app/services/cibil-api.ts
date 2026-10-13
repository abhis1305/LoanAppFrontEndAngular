import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class cibilapiService {

  http = inject(HttpClient);

  baseUrl = 'https://localhost:7008/api/Cibil';

  generateCibil(customerId: number) {
    return this.http.post<any>(
      `${this.baseUrl}/GenerateScore`,
      { customerId }
    );
  }

  getCibil(customerId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/GetScore/${customerId}`
    );
  }
}
