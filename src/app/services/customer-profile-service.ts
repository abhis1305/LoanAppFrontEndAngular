import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { AuthService } from './auth-service';

export interface CustomerProfileDto {
  userId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  mobileNo: string;
  pan: string;
  aadhaarNo: string;
  employmentType: string;
  monthlyIncome: number;
  monthlyInvestment: number;
  age: number;
}

export interface UpdateCustomerProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  age: number;
  employmentType: string;
  monthlyIncome: number;
  monthlyInvestment: number;
}

export interface ProfileUpdateResponse {
  message?: string;
  data?: CustomerProfileDto;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerProfileService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly apiUrl = 'https://localhost:7008/api/CustomerProfile';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // GET: api/CustomerProfile/me
  getMyProfile(): Observable<CustomerProfileDto> {
    return this.http
      .get<CustomerProfileDto>(`${this.apiUrl}/me`, {
        headers: this.getHeaders(),
      })
      .pipe(timeout({ first: 15000 }));
  }

  // PUT: api/CustomerProfile/me
  updateMyProfile(data: UpdateCustomerProfileDto): Observable<ProfileUpdateResponse> {
    return this.http
      .put<ProfileUpdateResponse>(`${this.apiUrl}/me`, data, {
        headers: this.getHeaders(),
      })
      .pipe(timeout({ first: 15000 }));
  }
}
