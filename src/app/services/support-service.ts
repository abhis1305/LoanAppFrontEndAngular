import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class SupportService {
    http=inject(HttpClient);

    getToken()
    {
        var keys=['token','jwt','accessToken','access_token','authToken'];
        for(var k of keys)
        {
            var t=localStorage.getItem(k) || sessionStorage.getItem(k);
            if(t) return t;
        }
        return null;
    }

    // the data inside the token
    getData():any
    {
        var token=this.getToken();
        if(!token) return null;
        try
        {
            var part=token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
            return JSON.parse(atob(part));
        }
        catch
        {
            return null;
        }
    }

    // the logged-in customer's id (0 = not logged in)
    getCustomerId()
    {
        var d=this.getData();
        if(!d) return 0;
        return Number(d['customerId'] || d['nameid']
            || d['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
            || d['sub'] || 0);
    }

    // adds  Authorization: Bearer <token>  to the call
    headers()
    {
        var t=this.getToken();
        return t ? new HttpHeaders({Authorization:`Bearer ${t}`}) : new HttpHeaders();
    }

    // ---------- customer ----------
    url="http://localhost:7008/api/SupportTicket/AddT";
    AddTicket(data:any)
    {
        return this.http.post<any>(this.url,data,{headers:this.headers()});
    }

    url2="http://localhost:7008/api/SupportTicket/MyT";
    getMyTickets(customerId:any)
    {
        return this.http.get<any>(`${this.url2}/${customerId}`,{headers:this.headers()});
    }

    // the customer's loan account (to fill the Raise Query form)
    url3="http://localhost:7008/api/Dashboard/ActiveLoan";
    getActiveLoan(customerId:any)
    {
        return this.http.get<any>(`${this.url3}/${customerId}`,{headers:this.headers()});
    }

    // ---------- officer ----------
    url4="http://localhost:7008/api/SupportTicket/GetT";
    getAllTickets()
    {
        return this.http.get<any>(this.url4,{headers:this.headers()});
    }

    url5="http://localhost:5235/api/SupportTicket/RespondT";
    RespondTicket(id:any,data:any)
    {
        return this.http.put<any>(`${this.url5}/${id}`,data,{headers:this.headers()});
    }
}