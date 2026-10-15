import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class DashboardService {
    http = inject(HttpClient);

    // ---------- customer dashboard ----------
    url = "http://localhost:7008/api/Dashboard/Cards";
    getCards(customerId: any)
    {
        return this.http.get<any>(`${this.url}/${customerId}`);
    }

    url2 = "http://localhost:7008/api/Dashboard/Progress";
    getProgress(customerId: any)
    {
        return this.http.get<any>(`${this.url2}/${customerId}`);
    }

    url3 = "http://localhost:7008/api/Dashboard/ActiveLoan";
    getActiveLoan(customerId: any)
    {
        return this.http.get<any>(`${this.url3}/${customerId}`);
    }

    url4 = "http://localhost:7008/api/Dashboard/EmiSummary";
    getEmiSummary(customerId: any)
    {
        return this.http.get<any>(`${this.url4}/${customerId}`);
    }

    url5 = "http://localhost:7008/api/Dashboard/RecentPayments";
    getRecentPayments(customerId: any)
    {
        return this.http.get<any>(`${this.url5}/${customerId}`);
    }

    url6 = "http://localhost:7008/api/Dashboard/Documents";
    getDocuments(customerId: any)
    {
        return this.http.get<any>(`${this.url6}/${customerId}`);
    }

    // ---------- officer dashboard (LOS + LMS) ----------
    url7 = "http://localhost:7008/api/Dashboard/Officer";
    getOfficerDashboard(from: string, to: string)
    {
        var q = "";
        if (from) q += `from=${from}&`;
        if (to) q += `to=${to}&`;
        return this.http.get<any>(q ? `${this.url7}?${q}` : this.url7);
    }
}