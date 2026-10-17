
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:7008/api/Notification';

  private getHeaders(): HttpHeaders 
  {
    const token = sessionStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getNotifications(customerId: number) 
  {
    return this.http.get<any[]>(
      `${this.apiUrl}/${customerId}`,
      { headers: this.getHeaders() 

      });
  }

  markAsRead(id: number) 
  {
    return this.http.put(
      `${this.apiUrl}/MarkAsRead/${id}`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
