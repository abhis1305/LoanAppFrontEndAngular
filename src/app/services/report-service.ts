import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class ReportService {
    http = inject(HttpClient);

    // same API address as your dashboard and auth services
    base = "http://localhost:7008/api/Reports";

    // builds  ?from=...&to=...  (empty dates are left out)
    private qs(from: string, to: string)
    {
        var q = "";
        if (from) q += `from=${from}&`;
        if (to) q += `to=${to}&`;
        return q ? `?${q}` : "";
    }

    // ---------- LOS ----------
    getProductWise(from: string, to: string)
    {
        return this.http.get<any>(`${this.base}/ProductWise` + this.qs(from, to));
    }

    getTat(from: string, to: string)
    {
        return this.http.get<any>(`${this.base}/Tat` + this.qs(from, to));
    }

    getCibilRange(from: string, to: string)
    {
        return this.http.get<any>(`${this.base}/CibilRange` + this.qs(from, to));
    }

    getScoreCardWise(from: string, to: string)
    {
        return this.http.get<any>(`${this.base}/ScoreCardWise` + this.qs(from, to));
    }

    // ---------- LMS ----------
    getPortfolio()
    {
        return this.http.get<any>(`${this.base}/Portfolio`);
    }

    getEmiCollection(from: string, to: string)
    {
        return this.http.get<any>(`${this.base}/EmiCollection` + this.qs(from, to));
    }

    getOverdue()
    {
        return this.http.get<any>(`${this.base}/Overdue`);
    }

    getDisbursement(from: string, to: string)
    {
        return this.http.get<any>(`${this.base}/Disbursement` + this.qs(from, to));
    }

    getPrepayment(from: string, to: string)
    {
        return this.http.get<any>(`${this.base}/Prepayment` + this.qs(from, to));
    }
}