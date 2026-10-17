
import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class SanctionLetterService {

     http = inject(HttpClient);

  url = 'http://localhost:7008/api/SanctionLetter';

  GetApprovedLoans() {
    return this.http.get<any>(`${this.url}/approved-loans`);
  }

  GetSanctionLetterData(dealId: number) {
    return this.http.get<any>(`${this.url}/${dealId}/data`);
  }

  GenerateSanctionLetter(dealId: number) {
    return this.http.post<any>(`${this.url}/${dealId}/generate`, {});
  }

  GetSanctionLetter(dealId: number) {
    return this.http.get<any>(`${this.url}/${dealId}`);
  }

 ViewSanctionLetterPdf(dealId: number) {
  window.open(`${this.url}/${dealId}/view`, '_blank');
}

DownloadSanctionLetterPdf(dealId: number) {
  window.open(`${this.url}/${dealId}/download`, '_blank');
}
}
