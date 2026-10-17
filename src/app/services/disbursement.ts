
import { inject, Service} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class DisbursementServices {

http = inject(HttpClient);

  url = 'http://localhost:7008/api/Disbursement';

  GetAll() {
    return this.http.get<any[]>(this.url);
  }

  Create(data: any) {
    return this.http.post<any>(this.url, data);
  }
}